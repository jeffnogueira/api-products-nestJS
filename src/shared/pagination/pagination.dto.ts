import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PaginationDto {

    @ApiProperty()
    @IsOptional()
    search: string;

    @ApiProperty()
    @IsOptional()
    orderBy: string;

    @ApiProperty()
    @IsOptional()
    direction: string;

    @ApiProperty()
    @IsOptional()
    pageIndex: string;

    @ApiProperty()
    @IsOptional()
    pageSize: string;

}
