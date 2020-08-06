import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, validate } from 'class-validator';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';

export class ProductQuery extends PaginationDto {

    @ApiProperty()
    @IsOptional()
    category: number;
}

validate(ProductQuery, { skipMissingProperties: true });
