import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/shared/interfaces/response.interface';
import { SuccessResponse } from 'src/shared/responses/success.response';
import { ErrorResponse } from 'src/shared/responses/error.response';
import { escape_string, encryptPasswordHash } from 'src/shared/utils/functions';
import { createQueryBuilder, Repository } from 'typeorm';
import { MESSAGES } from 'src/shared/enum/messages.enum';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { UserQuery } from './user.query';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(query?: UserQuery): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {

                const search = (query.search) ? query.search : null;

                const conditionsOptions = this.getConditionsOptions(query, search);

                const users = await createQueryBuilder(User, 'user')
                    .where(`${conditionsOptions.where} ORDER BY ${conditionsOptions.orderBy}
                        ${conditionsOptions.direction} ${conditionsOptions.pagination}`,
                        conditionsOptions.params)
                    .getManyAndCount();

                return resolve(new SuccessResponse({ data: users[0], size: users[1] }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    findOne(id: number): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.userRepository.findOne(id);

                if (!user) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND },
                        HttpStatus.NOT_FOUND));
                }

                return resolve(new SuccessResponse( user , HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    save(userData: UserDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const isEmailExists = await this.userRepository.findOne({ where: { email: userData.email } });

                if (isEmailExists) {
                    return reject(new ErrorResponse({ message: MESSAGES.EMAIL_EXISTS }, HttpStatus.BAD_REQUEST));
                }

                userData.password = await encryptPasswordHash(userData.password);

                const userToSave = new User(userData);

                const userSaved = await this.userRepository.save(userToSave);

                const userResponse = await this.userRepository.findOne(userSaved.idUser);

                return resolve(new SuccessResponse(userResponse, HttpStatus.CREATED));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    update(id: number, userData: UserDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await createQueryBuilder(User, 'user')
                    .where(`idUser = :id`, { id })
                    .getOne();

                if (!user) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND }, HttpStatus.NOT_FOUND));
                }

                const isEmailExists = await createQueryBuilder(User, 'user')
                    .where(`email = :email AND idUser <> :id`, { email: userData.email, id })
                    .getOne();

                if (isEmailExists) {
                    return reject(new ErrorResponse({ message: MESSAGES.EMAIL_EXISTS }, HttpStatus.BAD_REQUEST));
                }

                if (userData.password) {
                    userData.password = await encryptPasswordHash(userData.password);
                }

                const userToSave = new User(userData);

                await this.userRepository.update(id, userToSave);

                const userUpdated = await this.userRepository.findOne(id);

                return resolve(new SuccessResponse({ data: userUpdated }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    delete(id: number): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.userRepository.findOne(id);

                if (!user) {
                    return reject(new ErrorResponse({ message: MESSAGES.NOT_FOUND },
                        HttpStatus.NOT_FOUND));
                }

                await this.userRepository.delete(id);

                return resolve(new SuccessResponse({ data: MESSAGES.DELETED }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    getConditionsOptions(query: UserQuery, search: string): any {
        const sqlOptions = {
            where: '',
            orderBy: 'UPPER(user.name)',
            direction: 'ASC',
            search: '',
            params: { search },
            pagination: '',
        };

        sqlOptions.direction = (query.direction === 'desc' || query.direction === 'DESC') ? 'DESC' : 'ASC';

        const orders = {
            name: () => {
                sqlOptions.orderBy = 'UPPER(user.name)';
            },
            email: () => {
                sqlOptions.orderBy = 'UPPER(user.email)';
            },
        };

        const ordenation = orders[query.orderBy];

        if (ordenation) {
            ordenation();
        }

        if (search) {
            sqlOptions.search = `(UPPER(user.name) LIKE UPPER(:search) ESCAPE '$')`;
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
