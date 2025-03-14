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
var IotGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const iot_service_1 = require("./iot.service");
let IotGateway = IotGateway_1 = class IotGateway {
    constructor(iotService) {
        this.iotService = iotService;
        this.logger = new common_1.Logger(IotGateway_1.name);
    }
    afterInit(server) {
        this.logger.log("IoT WebSocket Gateway initialized");
        setInterval(async () => {
            try {
                const sensorData = await this.iotService.findAll();
                this.server.emit("sensor-data-update", sensorData);
            }
            catch (error) {
                this.logger.error(`Error broadcasting sensor data: ${error.message}`);
            }
        }, 5000);
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
        this.iotService.findAll().then((sensorData) => {
            client.emit("sensor-data-update", sensorData);
        });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    broadcastSensorUpdate(sensorData) {
        this.server.emit("sensor-data-update", sensorData);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], IotGateway.prototype, "server", void 0);
IotGateway = IotGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: "*",
        },
        namespace: "/iot",
    }),
    __metadata("design:paramtypes", [iot_service_1.IotService])
], IotGateway);
exports.IotGateway = IotGateway;
//# sourceMappingURL=iot.gateway.js.map