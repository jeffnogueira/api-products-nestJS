import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CategoryDto {

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 45)
    description: string;

}
