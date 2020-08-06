import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Min } from 'class-validator';

export class ProductDto {

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 500)
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    unitPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    interestPrice: number;

    @ApiProperty()
    @IsNotEmpty()
    @Min(0)
    percent: number;

    @ApiProperty()
    @IsNotEmpty()
    @Min(1)
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    idCategory: number;

}
