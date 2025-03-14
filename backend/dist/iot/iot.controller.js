"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var IotController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotController = void 0;
const common_1 = require("@nestjs/common");
const iot_service_1 = require("./iot.service");
const sensor_data_schema_1 = require("./schemas/sensor-data.schema");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const iot_gateway_1 = require("./iot.gateway");
let IotController = IotController_1 = class IotController {
    constructor(iotService, iotGateway) {
        this.iotService = iotService;
        this.iotGateway = iotGateway;
        this.logger = new common_1.Logger(IotController_1.name);
    }
    async createSensorData(sensorData) {
        const newSensorData = await this.iotService.create(sensorData);
        try {
            const allSensorData = await this.iotService.findAll();
            this.iotGateway.broadcastSensorUpdate(allSensorData);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast sensor update: ${error.message}`);
        }
        return newSensorData;
    }
    async getAllSensorData() {
        this.logger.log("Received request for sensor data");
        try {
            const data = await this.iotService.findAll();
            if (!data || data.length === 0) {
                this.logger.log("No sensor data found in database, returning mock data");
                const mockData = this.generateMockSensorData();
                try {
                    this.iotGateway.broadcastSensorUpdate(mockData);
                }
                catch (error) {
                    this.logger.error(`Failed to broadcast mock sensor update: ${error.message}`);
                }
                return mockData;
            }
            this.logger.log(`Returning ${data.length} sensor data records`);
            return data;
        }
        catch (error) {
            this.logger.error(`Error fetching sensor data: ${error.message}`);
            const mockData = this.generateMockSensorData();
            try {
                this.iotGateway.broadcastSensorUpdate(mockData);
            }
            catch (socketError) {
                this.logger.error(`Failed to broadcast mock sensor update: ${socketError.message}`);
            }
            return mockData;
        }
    }
    generateMockSensorData() {
        this.logger.log("Generating mock sensor data");
        const mockData = [];
        const types = ["air_quality", "traffic", "energy", "water", "noise"];
        const statuses = ["normal", "normal", "normal", "warning", "critical"];
        const baseLatitude = 40.7128;
        const baseLongitude = -74.006;
        for (let i = 0; i < 25; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            let value;
            switch (type) {
                case "air_quality":
                    value = Math.floor(Math.random() * 300);
                    break;
                case "traffic":
                    value = Math.floor(Math.random() * 1000) + 100;
                    break;
                case "energy":
                    value = Math.floor(Math.random() * 500) + 50;
                    break;
                case "water":
                    value = Math.floor(Math.random() * 100) + 10;
                    break;
                case "noise":
                    value = Math.floor(Math.random() * 40) + 50;
                    break;
                default:
                    value = Math.floor(Math.random() * 1000);
            }
            const latitude = baseLatitude + (Math.random() * 0.06 - 0.03);
            const longitude = baseLongitude + (Math.random() * 0.06 - 0.03);
            mockData.push({
                _id: `mock-sensor-${i}`,
                type,
                value,
                status,
                coordinates: [longitude, latitude],
                timestamp: new Date(),
                metadata: {
                    deviceId: `mock-device-${i}`,
                    batteryLevel: Math.floor(Math.random() * 100),
                    manufacturer: ["Siemens", "Bosch", "ABB", "Honeywell"][Math.floor(Math.random() * 4)],
                    model: ["SM100", "IoT-3000", "SmartSense"][Math.floor(Math.random() * 3)],
                    firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`,
                    lastMaintenance: new Date(Date.now() - Math.random() * 30 * 86400000)
                        .toISOString()
                        .split("T")[0],
                },
            });
        }
        return mockData;
    }
    async getSensorDataByType(type) {
        return this.iotService.findByType(type);
    }
    async getSensorDataByStatus(status) {
        return this.iotService.findByStatus(status);
    }
    async getLatestSensorData(type) {
        return this.iotService.findLatestByType(type);
    }
    async updateSensorStatus(id, status) {
        const updatedSensor = await this.iotService.updateStatus(id, status);
        try {
            const allSensorData = await this.iotService.findAll();
            this.iotGateway.broadcastSensorUpdate(allSensorData);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast sensor update after status change: ${error.message}`);
        }
        return updatedSensor;
    }
    async cleanupOldData(days) {
        await this.iotService.deleteOldData(days);
        try {
            const allSensorData = await this.iotService.findAll();
            this.iotGateway.broadcastSensorUpdate(allSensorData);
        }
        catch (error) {
            this.logger.error(`Failed to broadcast sensor update after cleanup: ${error.message}`);
        }
        return;
    }
    async getAnalytics(type, timeframe) {
        return this.iotService.getAggregatedData(type, timeframe);
    }
};
__decorate([
    (0, common_1.Post)("sensor-data"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sensor_data_schema_1.SensorData]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "createSensorData", null);
__decorate([
    (0, common_1.Get)("sensor-data"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getAllSensorData", null);
__decorate([
    (0, common_1.Get)("sensor-data/type/:type"),
    __param(0, (0, common_1.Param)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getSensorDataByType", null);
__decorate([
    (0, common_1.Get)("sensor-data/status/:status"),
    __param(0, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getSensorDataByStatus", null);
__decorate([
    (0, common_1.Get)("sensor-data/latest/:type"),
    __param(0, (0, common_1.Param)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getLatestSensorData", null);
__decorate([
    (0, common_1.Put)("sensor-data/:id/status"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "updateSensorStatus", null);
__decorate([
    (0, common_1.Delete)("sensor-data/cleanup"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "cleanupOldData", null);
__decorate([
    (0, common_1.Get)("sensor-data/analytics"),
    __param(0, (0, common_1.Query)("type")),
    __param(1, (0, common_1.Query)("timeframe")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], IotController.prototype, "getAnalytics", null);
IotController = IotController_1 = __decorate([
    (0, common_1.Controller)("iot"),
    __metadata("design:paramtypes", [iot_service_1.IotService,
        iot_gateway_1.IotGateway])
], IotController);
exports.IotController = IotController;
//# sourceMappingURL=iot.controller.js.map