import { Model } from "mongoose";
import { SensorData, SensorDataDocument } from "./schemas/sensor-data.schema";
export declare class IotService {
    private sensorDataModel;
    constructor(sensorDataModel: Model<SensorDataDocument>);
    create(sensorData: SensorData): Promise<SensorData>;
    findAll(): Promise<SensorData[]>;
    findByType(type: string): Promise<SensorData[]>;
    findByStatus(status: string): Promise<SensorData[]>;
    findLatestByType(type: string): Promise<SensorData | null>;
    updateStatus(id: string, status: string): Promise<SensorData | null>;
    deleteOldData(days: number): Promise<void>;
    getAggregatedData(type: string, timeframe: string): Promise<any[]>;
}
