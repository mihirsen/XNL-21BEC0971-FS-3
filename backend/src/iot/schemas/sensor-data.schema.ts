import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SensorDataDocument = SensorData & Document;

@Schema()
export class SensorData {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  value: number;

  @Prop({
    required: true,
    enum: ["normal", "warning", "critical"],
    default: "normal",
  })
  status: string;

  @Prop({ required: true })
  coordinates: [number, number];

  @Prop({ required: true, default: Date.now })
  timestamp: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const SensorDataSchema = SchemaFactory.createForClass(SensorData);
