"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger("Bootstrap");
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get("PORT", 3001);
    const corsOrigin = configService.get("CORS_ORIGIN", "http://localhost:3000");
    logger.log(`Configuring CORS for origin: ${corsOrigin}`);
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
    logger.log(`WebSocket gateway should be available at: ws://localhost:${port}/iot`);
}
bootstrap();
//# sourceMappingURL=main.js.map