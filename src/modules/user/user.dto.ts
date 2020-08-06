import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserDto {

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 45)
    name: string;

    @ApiProperty()
    @IsEmail()
    @Length(1, 100)
    email: string;

    password: string;

}
