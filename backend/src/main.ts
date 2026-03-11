import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS for the mobile app
  app.setGlobalPrefix('api'); // Define a global route prefix

  // Enable global validation pipe to prevent mass assignment (strips un-whitelisted properties)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip any fields not defined in the DTO
      forbidNonWhitelisted: true, // throw error if non-whitelisted fields are provided
      transform: true, // automatically transform payloads to be objects typed according to their DTO classes
    }),
  );

  // Initialize Firebase Admin SDK
  // In a real scenario, this should load credentials from environment variables or a service account file
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend server listening on port ${port}`);
}
bootstrap();
