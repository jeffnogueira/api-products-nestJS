import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasyconfigModule } from 'nestjs-easyconfig';

import { AuthModule } from './auth/auth.module';

import { Category } from './category/category.entity';
import { CategoryModule } from './category/category.module';
import { Product } from './product/product.entity';
import { ProductModule } from './product/product.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        EasyconfigModule.register({}),
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST,
            port: Number(process.env.MYSQL_PORT),
            username: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASS,
            database: process.env.MYSQL_DATABASE_NAME,
            entities: [
                Category,
                Product,
                User,
            ],
            synchronize: true,
            migrations: ['/src/config/migrations/*.ts'],
            cli: {
                migrationsDir: '/src/config/migrations',
            },
        }),

        AuthModule,
        CategoryModule,
        ProductModule,
        UserModule,
    ],
})

export class AppModule { }
