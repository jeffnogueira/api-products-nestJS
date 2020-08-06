import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/shared/interfaces/response.interface';
import { SuccessResponse } from 'src/shared/responses/success.response';
import { ErrorResponse } from 'src/shared/responses/error.response';
import { escape_string } from 'src/shared/utils/functions';
import { createQueryBuilder, Repository, getRepository } from 'typeorm';
import { MESSAGES } from 'src/shared/enum/messages.enum';
import { CategoryDto } from './category.dto';
import { Category } from './category.entity';
import { CategoryQuery } from './category.query';
import { Product } from '../product/product.entity';

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    findAll(query?: CategoryQuery): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {

                const search = (query.search) ? query.search : null;

                const conditionsOptions = this.getConditionsOptions(query, search);

                const categories = await createQueryBuilder(Category, 'category')
                    .where(`${conditionsOptions.where} ORDER BY ${conditionsOptions.orderBy}
                        ${conditionsOptions.direction} ${conditionsOptions.pagination}`,
                        conditionsOptions.params)
                    .getManyAndCount();

                return resolve(new SuccessResponse({ data: categories[0], size: categories[1] }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    findOne(id: number): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await this.categoryRepository.findOne(id);

                if (!category) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND },
                        HttpStatus.NOT_FOUND));
                }

                return resolve(new SuccessResponse( category , HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    save(categoryData: CategoryDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const isDescriptionExists = await this.categoryRepository.findOne({ where: { description: categoryData.description } });

                if (isDescriptionExists) {
                    return reject(new ErrorResponse({ message: MESSAGES.DESCRIPTION_EXISTS }, HttpStatus.BAD_REQUEST));
                }

                const categoryToSave = new Category(categoryData);

                const categorySaved = await this.categoryRepository.save(categoryToSave);

                const categoryResponse = await this.categoryRepository.findOne(categorySaved.idCategory);

                return resolve(new SuccessResponse({ data: categoryResponse }, HttpStatus.CREATED));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    update(id: number, categoryData: CategoryDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await createQueryBuilder(Category, 'category')
                    .where(`idCategory = :id`, { id })
                    .getOne();

                if (!category) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND }, HttpStatus.NOT_FOUND));
                }

                const isDescriptionExists = await createQueryBuilder(Category, 'category')
                    .where(`description = :description AND idCategory <> :id`, { description: categoryData.description, id })
                    .getOne();

                if (isDescriptionExists) {
                    return reject(new ErrorResponse({ message: MESSAGES.DESCRIPTION_EXISTS }, HttpStatus.BAD_REQUEST));
                }

                const categoryToSave = new Category(categoryData);

                await this.categoryRepository.update(id, categoryToSave);

                const categoryUpdated = await this.categoryRepository.findOne(id);

                return resolve(new SuccessResponse({ data: categoryUpdated }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    delete(id: number): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const category = await this.categoryRepository.findOne(id, { relations: ['products'] });

                if (!category) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND }, HttpStatus.NOT_FOUND));
                }

                if (category.products.length > 0) {
                    return reject(new ErrorResponse({ message: MESSAGES.PRODUCT_EXISTS }, HttpStatus.NOT_FOUND));
                }

                await this.categoryRepository.delete(id);

                return resolve(new SuccessResponse({ data: MESSAGES.DELETED }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    getConditionsOptions(query: CategoryQuery, search: string): any {
        const sqlOptions = {
            where: '',
            orderBy: 'UPPER(category.description)',
            direction: 'ASC',
            search: '',
            params: { search },
            pagination: '',
        };

        sqlOptions.direction = (query.direction === 'desc' || query.direction === 'DESC') ? 'DESC' : 'ASC';

        const orders = {
            description: () => {
                sqlOptions.orderBy = 'UPPER(category.description)';
            },
        };

        const ordenation = orders[query.orderBy];

        if (ordenation) {
            ordenation();
        }

        if (search) {
            sqlOptions.search = `(UPPER(category.description) LIKE UPPER(:search) ESCAPE '$')`;
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
