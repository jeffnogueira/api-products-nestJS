import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/shared/interfaces/response.interface';
import { SuccessResponse } from 'src/shared/responses/success.response';
import { ErrorResponse } from 'src/shared/responses/error.response';
import { escape_string } from 'src/shared/utils/functions';
import { createQueryBuilder, Repository, getRepository } from 'typeorm';
import { MESSAGES } from 'src/shared/enum/messages.enum';
import { ProductDto } from './product.dto';
import { Product } from './product.entity';
import { ProductQuery } from './product.query';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }

    findAll(query?: ProductQuery): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {

                const search = (query.search) ? query.search : null;

                const conditionsOptions = this.getConditionsOptions(query, search);

                const products = await createQueryBuilder(Product, 'product')
                    .leftJoinAndSelect('product.category', 'category')
                    .where(`${conditionsOptions.where} ORDER BY ${conditionsOptions.orderBy}
                        ${conditionsOptions.direction} ${conditionsOptions.pagination}`,
                        conditionsOptions.params)
                    .getManyAndCount();

                return resolve(new SuccessResponse({ data: products[0], size: products[1] }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    findOne(id: number): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await createQueryBuilder(Product, 'product')
                    .leftJoinAndSelect('product.category', 'category')
                    .where(`product.idProduct = :id`, { id })
                    .getOne();

                if (!product) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND },
                        HttpStatus.NOT_FOUND));
                }

                return resolve(new SuccessResponse( product , HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    save(productData: ProductDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await getRepository(Category).findOne(productData.idCategory);

                if (!category) {
                    return reject(new ErrorResponse({ message: MESSAGES.CATEGORY_DONT_EXISTS }, HttpStatus.NOT_FOUND));
                }

                const productToSave = new Product(productData);
                productToSave.category = category;

                const productSaved = await this.productRepository.save(productToSave);

                const productResponse = await this.productRepository.findOne(productSaved.idProduct, { relations: ['category'] });

                return resolve(new SuccessResponse({ data: productResponse }, HttpStatus.CREATED));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    update(id: number, productData: ProductDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await createQueryBuilder(Product, 'product')
                    .leftJoinAndSelect('product.category', 'category')
                    .where(`idProduct = :id`, { id })
                    .getOne();

                if (!product) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND }, HttpStatus.NOT_FOUND));
                }

                const isCategoryExists = await getRepository(Category).findOne(productData.idCategory);

                if (!isCategoryExists) {
                    return reject(new ErrorResponse({ message: MESSAGES.CATEGORY_DONT_EXISTS }, HttpStatus.NOT_FOUND));
                }

                const productToSave = new Product(productData);

                await this.productRepository.update(id, productToSave);

                const productUpdated = await this.productRepository.findOne(id, { relations: ['category'] });

                return resolve(new SuccessResponse({ data: productUpdated }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    delete(id: number): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const product = await this.productRepository.findOne(id);

                if (!product) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND }, HttpStatus.NOT_FOUND));
                }

                await this.productRepository.delete(id);

                return resolve(new SuccessResponse({ data: MESSAGES.DELETED }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    getConditionsOptions(query: ProductQuery, search: string): any {
        const sqlOptions = {
            where: '',
            orderBy: 'UPPER(product.idProduct)',
            direction: 'DESC',
            search: '',
            params: { search },
            pagination: '',
        };

        sqlOptions.direction = (query.direction === 'desc' || query.direction === 'DESC') ? 'DESC' : 'ASC';

        const orders = {
            category: () => {
                sqlOptions.orderBy = 'UPPER(product.category)';
            },
            name: () => {
                sqlOptions.orderBy = 'UPPER(product.name)';
            },
            unitPrice: () => {
                sqlOptions.orderBy = 'UPPER(product.unitPrice)';
            },
            interestPrice: () => {
                sqlOptions.orderBy = 'UPPER(product.interestPrice)';
            },
            percent: () => {
                sqlOptions.orderBy = 'UPPER(product.percent)';
            },
            quantity: () => {
                sqlOptions.orderBy = 'UPPER(product.quantity)';
            },
        };

        const ordenation = orders[query.orderBy];

        if (ordenation) {
            ordenation();
        }

        if (search) {
            sqlOptions.search = `(UPPER(product.name) LIKE UPPER(:search) ESCAPE '$') OR
                (UPPER(category.description) LIKE UPPER(:search) ESCAPE '$')`;
            search = escape_string(search, '%');
            search = escape_string(search, '_');
            sqlOptions.params.search = `%${search}%`;
        }

        if (sqlOptions.search) {
            sqlOptions.where = `${sqlOptions.search}`;
        }

        sqlOptions.where = (sqlOptions.where === '') ? '1=1' : sqlOptions.where;

        if (query.pageSize && query.pageIndex) {
            const pageSize = Number(query.pageSize);
            const pageIndex = Number(query.pageIndex);
            if (!Number.isNaN(pageSize) && !Number.isNaN(pageIndex)) {
                const skip = pageSize * pageIndex;
                sqlOptions.pagination = ` LIMIT ${skip}, ${query.pageSize}`;
            }
        }

        return sqlOptions;
    }
}
