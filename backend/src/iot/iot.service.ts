import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { SensorData, SensorDataDocument } from "./schemas/sensor-data.schema";

@Injectable()
export class IotService {
  constructor(
    @InjectModel(SensorData.name)
    private sensorDataModel: Model<SensorDataDocument>
  ) {}

  async create(sensorData: SensorData): Promise<SensorData> {
    const createdSensorData = new this.sensorDataModel(sensorData);
    return createdSensorData.save();
  }

  async findAll(): Promise<SensorData[]> {
    return this.sensorDataModel.find().exec();
  }

  async findByType(type: string): Promise<SensorData[]> {
    return this.sensorDataModel.find({ type }).exec();
  }

  async findByStatus(status: string): Promise<SensorData[]> {
    return this.sensorDataModel.find({ status }).exec();
  }

  async findLatestByType(type: string): Promise<SensorData | null> {
    return this.sensorDataModel
      .findOne({ type })
      .sort({ timestamp: -1 })
      .exec();
  }

  async updateStatus(id: string, status: string): Promise<SensorData | null> {
    return this.sensorDataModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
  }

  async deleteOldData(days: number): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await this.sensorDataModel
      .deleteMany({ timestamp: { $lt: cutoffDate } })
      .exec();
  }

  async getAggregatedData(type: string, timeframe: string): Promise<any[]> {
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
}
