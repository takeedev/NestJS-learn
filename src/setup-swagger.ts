import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { appEnvironment } from './config/app-environment.js';

export function setupSwagger(app: INestApplication): void {
  const swaggerEnabled =
    process.env.SWAGGER_ENABLED === undefined
      ? appEnvironment === 'local'
      : process.env.SWAGGER_ENABLED === 'true';

  if (swaggerEnabled) {
    const config = new DocumentBuilder().setTitle('Todo API').build();
    SwaggerModule.setup('docs', app, () =>
      SwaggerModule.createDocument(app, config),
    );
  }
}
