import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';
import { CategoryQuery } from './category.query';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ) { }

    @Get()
    async findAll(@Res() res: Response, @Query() query?: CategoryQuery) {
        try {

            const response = await this.categoryService.findAll(query);

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
            const response = await this.categoryService.findOne(id);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Post()
    async save(@Body() categoryDto: CategoryDto, @Res() res: Response) {
        try {
            const response = await this.categoryService.save(categoryDto);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() categoryDto: CategoryDto, @Res() res: Response) {
        try {
            const response = await this.categoryService.update(id, categoryDto);

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
            const response = await this.categoryService.delete(id);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }
}
