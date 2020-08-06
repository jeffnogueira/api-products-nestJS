import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app): void => {
    const swaggerOptions = new DocumentBuilder()
        .setTitle('Dulci Modas')
        .setVersion('1.0')
        .setDescription('Rotas para api Dulci Modas.')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions);

    SwaggerModule.setup('swagger', app, document);
};
