import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateTokenDto {

    @ApiProperty()
    @IsNotEmpty()
    token: string;

}
