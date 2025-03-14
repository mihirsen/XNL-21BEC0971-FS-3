"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const iot_module_1 = require("./iot/iot.module");
const auth_module_1 = require("./auth/auth.module");
const mongodb_memory_server_1 = require("mongodb-memory-server");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async () => {
                    if (process.env.KUBERNETES_DEPLOYMENT === "true") {
                        const uri = process.env.MONGODB_URI ||
                            "mongodb://mongodb-service:27017/smartcity";
                        console.log("Running in Kubernetes environment, connecting to:", uri);
                        return { uri };
                    }
                    if (process.env.MONGODB_USE_MEMORY_SERVER === "true") {
                        const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
                        const uri = mongod.getUri();
                        console.log("Using MongoDB Memory Server:", uri);
                        return { uri };
                    }
                    const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-city";
                    console.log("Using standard MongoDB connection:", uri);
                    return { uri };
                },
            }),
            iot_module_1.IotModule,
            auth_module_1.AuthModule,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map