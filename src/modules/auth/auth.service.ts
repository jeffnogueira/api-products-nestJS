import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/shared/interfaces/response.interface';
import { SuccessResponse } from 'src/shared/responses/success.response';
import { ErrorResponse } from 'src/shared/responses/error.response';
import { comparePasswordHash } from 'src/shared/utils/functions';
import { MESSAGES } from 'src/shared/enum/messages.enum';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    login(authDto: AuthDto): Promise<Response> {
        return new Promise(async (resolve, reject) => {
            try {
                const { email, password } = authDto;

                const user: User = await this.findOneByEmail(email);

                if (!user) {
                    return reject(new ErrorResponse({ message: MESSAGES.INVALID_CREDENTIALS }, HttpStatus.FORBIDDEN));
                }

                const equalPasswords = await comparePasswordHash(password, user.password);

                if (!equalPasswords) {
                    return reject(new ErrorResponse({ message: MESSAGES.INVALID_CREDENTIALS }, HttpStatus.FORBIDDEN));
                }

                delete user.password;

                const token = await this.generateAuthToken({ user });

                return resolve(new SuccessResponse({ token, user }, HttpStatus.OK));
            } catch (err) {
                return reject(new ErrorResponse({ message: err.message }, HttpStatus.INTERNAL_SERVER_ERROR));
            }
        });
    }

    findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email }, select: ['idUser', 'name', 'email', 'password'] });
    }

    async generateAuthToken(data): Promise<string> {
        return this.jwtService.sign({ ...data }, { expiresIn: '30h'});
    }

    validateToken(token: string): Promise<any> {
        return this.jwtService.verifyAsync(token);
    }
}
