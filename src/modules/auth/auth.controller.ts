import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthDto } from './auth.dto';
import { ValidateTokenDto } from './validate-token.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
    ) { }

    @Post()
    async auth(@Body() authDto: AuthDto, @Res() res: Response) {
        try {
            const response = await this.authService.login(authDto);

            return res.status(response.status).send(response.data);
        } catch (err) {
        if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
            return res.status(err.status).send({ message: err.error.message });
        }
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Post('verify-token')
    async verifyToken(@Body() validateTokenDto: ValidateTokenDto, @Res() res: Response) {
        try {
        await this.authService.validateToken(validateTokenDto.token);

        return res.status(HttpStatus.OK).send();

        } catch (err) {

        return res.status(HttpStatus.UNAUTHORIZED).send({ error: { message: err.message } });
        }
    }
}
