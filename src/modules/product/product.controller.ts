import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ProductDto } from './product.dto';
import { ProductService } from './product.service';
import { ProductQuery } from './product.query';

@Controller('products')
@UseGuards(AuthGuard('jwt'))
export class ProductController {
    constructor(
        private productService: ProductService,
    ) { }

    @Get()
    async findAll(@Res() res: Response, @Query() query?: ProductQuery) {
        try {

            const response = await this.productService.findAll(query);

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
            const response = await this.productService.findOne(id);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Post()
    async save(@Body() productDto: ProductDto, @Res() res: Response) {
        try {
            const response = await this.productService.save(productDto);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() productDto: ProductDto, @Res() res: Response) {
        try {
            const response = await this.productService.update(id, productDto);

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
            const response = await this.productService.delete(id);

            return res.status(response.status).send(response.data);
        } catch (err) {
            if (err.hasOwnProperty('error') && err.hasOwnProperty('hasError')) {
                return res.status(err.status).send({ message: err.error.message });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ message: err.message });
        }
    }
}
