import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { IotService } from "./iot.service";
export declare class IotGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly iotService;
    private readonly logger;
    constructor(iotService: IotService);
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastSensorUpdate(sensorData: any): void;
}
