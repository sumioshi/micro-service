import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`ReservationService is running on: ${await app.getUrl()}`);
}
bootstrap();
