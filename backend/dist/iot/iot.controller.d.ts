import { IotService } from "./iot.service";
import { SensorData } from "./schemas/sensor-data.schema";
import { IotGateway } from "./iot.gateway";
export declare class IotController {
    private readonly iotService;
    private readonly iotGateway;
    private readonly logger;
    constructor(iotService: IotService, iotGateway: IotGateway);
    createSensorData(sensorData: SensorData): Promise<SensorData>;
    getAllSensorData(): Promise<SensorData[]>;
    private generateMockSensorData;
    getSensorDataByType(type: string): Promise<SensorData[]>;
    getSensorDataByStatus(status: string): Promise<SensorData[]>;
    getLatestSensorData(type: string): Promise<SensorData | null>;
    updateSensorStatus(id: string, status: string): Promise<SensorData | null>;
    cleanupOldData(days: number): Promise<void>;
    getAnalytics(type: string, timeframe: string): Promise<any[]>;
}
