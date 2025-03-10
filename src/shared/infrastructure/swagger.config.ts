import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function configureSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('Companies API')
        .setDescription('API to manage companies and transfers')
        .setVersion('1.0')
        .addTag('Companies')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/documentation', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            tryItOutEnabled: true,
        },
    });
}