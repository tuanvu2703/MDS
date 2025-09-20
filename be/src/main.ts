import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // Enable raw body parsing for large files
  });

  //Configure timeout for large file uploads (10 minutes)
  app.use((req, res, next) => {
    req.setTimeout(10 * 60 * 1000); // 10 minutes
    res.setTimeout(10 * 60 * 1000); // 10 minutes
    next();
  });

  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:3000'], // Add your frontend URLs
    credentials: true,
  });

  // Configure body parser for larger payloads
  app.use((req, res, next) => {
    // Increase payload size limit to 200MB
    if (req.is('multipart/form-data')) {
      req.setMaxListeners(0);
    }
    next();
  });

  // Global validation pipe with proper configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties not defined in DTO
      forbidNonWhitelisted: true, // Throw error for extra properties
      transform: true, // Transform payloads to match DTO types
      transformOptions: {
        enableImplicitConversion: true, // Allow automatic type conversion
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
