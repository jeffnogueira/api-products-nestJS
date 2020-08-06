import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import authSecret from '../../configs/auth-secret';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: authSecret.AUTH_SECRET }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule { }
