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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IotService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sensor_data_schema_1 = require("./schemas/sensor-data.schema");
let IotService = class IotService {
    constructor(sensorDataModel) {
        this.sensorDataModel = sensorDataModel;
    }
    async create(sensorData) {
        const createdSensorData = new this.sensorDataModel(sensorData);
        return createdSensorData.save();
    }
    async findAll() {
        return this.sensorDataModel.find().exec();
    }
    async findByType(type) {
        return this.sensorDataModel.find({ type }).exec();
    }
    async findByStatus(status) {
        return this.sensorDataModel.find({ status }).exec();
    }
    async findLatestByType(type) {
        return this.sensorDataModel
            .findOne({ type })
            .sort({ timestamp: -1 })
            .exec();
    }
    async updateStatus(id, status) {
        return this.sensorDataModel
            .findByIdAndUpdate(id, { status }, { new: true })
            .exec();
    }
    async deleteOldData(days) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        await this.sensorDataModel
            .deleteMany({ timestamp: { $lt: cutoffDate } })
            .exec();
    }
    async getAggregatedData(type, timeframe) {
        const now = new Date();
        let startDate = new Date();
        switch (timeframe) {
            case "hour":
                startDate.setHours(now.getHours() - 1);
                break;
            case "day":
                startDate.setDate(now.getDate() - 1);
                break;
            case "week":
                startDate.setDate(now.getDate() - 7);
                break;
            default:
                startDate.setHours(now.getHours() - 1);
        }
        return this.sensorDataModel
            .aggregate([
            {
                $match: {
                    type,
                    timestamp: { $gte: startDate, $lte: now },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d %H:00", date: "$timestamp" },
                    },
                    avgValue: { $avg: "$value" },
                    maxValue: { $max: "$value" },
                    minValue: { $min: "$value" },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ])
            .exec();
    }
};
IotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sensor_data_schema_1.SensorData.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IotService);
exports.IotService = IotService;
//# sourceMappingURL=iot.service.js.map