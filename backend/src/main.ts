import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3001);
  const corsOrigin = configService.get<string>(
    "CORS_ORIGIN",
    "http://localhost:3000"
  );

  logger.log(`Configuring CORS for origin: ${corsOrigin}`);

  // Enhanced CORS configuration
  app.enableCors({
    origin: [corsOrigin, "http://localhost:3000", "*"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Content-Disposition"],
    maxAge: 3600,
  });

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(
    `WebSocket gateway should be available at: ws://localhost:${port}/iot`
  );
}

bootstrap();
