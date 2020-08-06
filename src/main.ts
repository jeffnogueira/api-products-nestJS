import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './modules/app.module';
import swaggerConfig from './configs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    app.use(helmet());

    app.enableCors();

    swaggerConfig(app);

    await app.listen(process.env.PORT || 3000);
}

bootstrap();
