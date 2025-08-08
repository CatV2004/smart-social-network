import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Social network')
    .setDescription('API documentation for the Social network Pro')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // URL: http://localhost:3000/api-docs

  app.use('/api-json', (_, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(document);
  });
}
