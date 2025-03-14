import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { IotController } from "./iot.controller";
import { IotService } from "./iot.service";
import { SensorData, SensorDataSchema } from "./schemas/sensor-data.schema";
import { IotGateway } from "./iot.gateway";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SensorData.name, schema: SensorDataSchema },
    ]),
  ],
  controllers: [IotController],
  providers: [IotService, IotGateway],
  exports: [IotService],
})
export class IotModule {}
