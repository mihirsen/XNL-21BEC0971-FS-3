import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  Delete,
  UseGuards,
  Logger,
} from "@nestjs/common";
import { IotService } from "./iot.service";
import { SensorData } from "./schemas/sensor-data.schema";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IotGateway } from "./iot.gateway";

@Controller("iot")
export class IotController {
  private readonly logger = new Logger(IotController.name);

  constructor(
    private readonly iotService: IotService,
    private readonly iotGateway: IotGateway
  ) {}

  @Post("sensor-data")
  @UseGuards(JwtAuthGuard)
  async createSensorData(@Body() sensorData: SensorData): Promise<SensorData> {
    const newSensorData = await this.iotService.create(sensorData);

    // Emit real-time update via WebSocket
    try {
      const allSensorData = await this.iotService.findAll();
      this.iotGateway.broadcastSensorUpdate(allSensorData);
    } catch (error) {
      this.logger.error(`Failed to broadcast sensor update: ${error.message}`);
    }

    return newSensorData;
  }

  @Get("sensor-data")
  async getAllSensorData(): Promise<SensorData[]> {
    this.logger.log("Received request for sensor data");
    try {
      const data = await this.iotService.findAll();
      // If no data is found, return mock data
      if (!data || data.length === 0) {
        this.logger.log(
          "No sensor data found in database, returning mock data"
        );
        const mockData = this.generateMockSensorData();

        // Broadcast mock data via WebSocket for real-time updates
        try {
          this.iotGateway.broadcastSensorUpdate(mockData);
        } catch (error) {
          this.logger.error(
            `Failed to broadcast mock sensor update: ${error.message}`
          );
        }

        return mockData;
      }

      this.logger.log(`Returning ${data.length} sensor data records`);
      return data;
    } catch (error) {
      this.logger.error(`Error fetching sensor data: ${error.message}`);
      // Return mock data on error
      const mockData = this.generateMockSensorData();

      // Broadcast mock data via WebSocket for real-time updates
      try {
        this.iotGateway.broadcastSensorUpdate(mockData);
      } catch (socketError) {
        this.logger.error(
          `Failed to broadcast mock sensor update: ${socketError.message}`
        );
      }

      return mockData;
    }
  }

  // Generate mock sensor data for when the DB is unavailable
  private generateMockSensorData(): SensorData[] {
    this.logger.log("Generating mock sensor data");
    const mockData: any[] = []; // Use any type to bypass strict typing for mock data
    const types = ["air_quality", "traffic", "energy", "water", "noise"];
    const statuses = ["normal", "normal", "normal", "warning", "critical"];

    // New York City coordinates
    const baseLatitude = 40.7128;
    const baseLongitude = -74.006;

    for (let i = 0; i < 25; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      let value: number;
      switch (type) {
        case "air_quality":
          value = Math.floor(Math.random() * 300); // AQI value
          break;
        case "traffic":
          value = Math.floor(Math.random() * 1000) + 100; // vehicles per hour
          break;
        case "energy":
          value = Math.floor(Math.random() * 500) + 50; // kWh
          break;
        case "water":
          value = Math.floor(Math.random() * 100) + 10; // L/min
          break;
        case "noise":
          value = Math.floor(Math.random() * 40) + 50; // dB
          break;
        default:
          value = Math.floor(Math.random() * 1000);
      }

      // Generate random coordinates within the city area
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
          manufacturer: ["Siemens", "Bosch", "ABB", "Honeywell"][
            Math.floor(Math.random() * 4)
          ],
          model: ["SM100", "IoT-3000", "SmartSense"][
            Math.floor(Math.random() * 3)
          ],
          firmwareVersion: `v${Math.floor(Math.random() * 5)}.${Math.floor(
            Math.random() * 10
          )}`,
          lastMaintenance: new Date(Date.now() - Math.random() * 30 * 86400000)
            .toISOString()
            .split("T")[0],
        },
      });
    }

    return mockData;
  }

  @Get("sensor-data/type/:type")
  async getSensorDataByType(
    @Param("type") type: string
  ): Promise<SensorData[]> {
    return this.iotService.findByType(type);
  }

  @Get("sensor-data/status/:status")
  async getSensorDataByStatus(
    @Param("status") status: string
  ): Promise<SensorData[]> {
    return this.iotService.findByStatus(status);
  }

  @Get("sensor-data/latest/:type")
  async getLatestSensorData(
    @Param("type") type: string
  ): Promise<SensorData | null> {
    return this.iotService.findLatestByType(type);
  }

  @Put("sensor-data/:id/status")
  @UseGuards(JwtAuthGuard)
  async updateSensorStatus(
    @Param("id") id: string,
    @Body("status") status: string
  ): Promise<SensorData | null> {
    const updatedSensor = await this.iotService.updateStatus(id, status);

    // Emit real-time update via WebSocket
    try {
      const allSensorData = await this.iotService.findAll();
      this.iotGateway.broadcastSensorUpdate(allSensorData);
    } catch (error) {
      this.logger.error(
        `Failed to broadcast sensor update after status change: ${error.message}`
      );
    }

    return updatedSensor;
  }

  @Delete("sensor-data/cleanup")
  @UseGuards(JwtAuthGuard)
  async cleanupOldData(@Query("days") days: number): Promise<void> {
    await this.iotService.deleteOldData(days);

    // Emit real-time update via WebSocket
    try {
      const allSensorData = await this.iotService.findAll();
      this.iotGateway.broadcastSensorUpdate(allSensorData);
    } catch (error) {
      this.logger.error(
        `Failed to broadcast sensor update after cleanup: ${error.message}`
      );
    }

    return;
  }

  @Get("sensor-data/analytics")
  async getAnalytics(
    @Query("type") type: string,
    @Query("timeframe") timeframe: string
  ): Promise<any[]> {
    return this.iotService.getAggregatedData(type, timeframe);
  }
}
