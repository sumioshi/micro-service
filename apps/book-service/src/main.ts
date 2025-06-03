import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`BookService is running on: ${await app.getUrl()}`);
}
bootstrap();
