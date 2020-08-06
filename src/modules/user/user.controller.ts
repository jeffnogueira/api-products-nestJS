import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { UserQuery } from './user.query';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
    constructor(
        private userService: UserService,
    ) { }

    @Get()
    async findAll(@Res() res: Response, @Query() query?: UserQuery) {
        try {

            const response = await this.userService.findAll(query);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Res() res: Response) {
        try {
            const response = await this.userService.findOne(id);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Post()
    async save(@Body() userDto: UserDto, @Res() res: Response) {
        try {
            const response = await this.userService.save(userDto);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() userDto: UserDto, @Res() res: Response) {
        try {
            const response = await this.userService.update(id, userDto);

            return res.status(response.status).send(response.data);

        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Res() res: Response) {
        try {
            const response = await this.userService.delete(id);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }
}
