import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, validate } from 'class-validator';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';

export class CategoryQuery extends PaginationDto {

    @ApiProperty()
    @IsOptional()
    description: string;
}

validate(CategoryQuery, { skipMissingProperties: true });
