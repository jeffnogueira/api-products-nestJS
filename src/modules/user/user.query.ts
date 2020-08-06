import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, validate } from 'class-validator';
import { PaginationDto } from 'src/shared/pagination/pagination.dto';

export class UserQuery extends PaginationDto {

    @ApiProperty()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    email: string;
}

validate(UserQuery, { skipMissingProperties: true });
