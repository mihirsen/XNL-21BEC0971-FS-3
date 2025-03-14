import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { IotService } from "./iot.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "/iot",
})
export class IotGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(IotGateway.name);

  constructor(private readonly iotService: IotService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.logger.log("IoT WebSocket Gateway initialized");

    // Set up a periodic data broadcast
    setInterval(async () => {
      try {
        const sensorData = await this.iotService.findAll();
        this.server.emit("sensor-data-update", sensorData);
      } catch (error) {
        this.logger.error(`Error broadcasting sensor data: ${error.message}`);
      }
    }, 5000); // Send updates every 5 seconds
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Send initial data to the connecting client
    this.iotService.findAll().then((sensorData) => {
      client.emit("sensor-data-update", sensorData);
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Method to broadcast a sensor data update (can be called from service)
  broadcastSensorUpdate(sensorData: any) {
    this.server.emit("sensor-data-update", sensorData);
  }
}
