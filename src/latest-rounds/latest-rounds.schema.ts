import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IRoundDetail } from "src/interfaces/restake";

export type LatestRoundsDocument = LatestRounds & Document;

@Schema()
export class LatestRounds {
  @Prop({ required: true })
  round: number;

  @Prop({ required: true })
  scheduleDate: string;

  @Prop({ required: true })
  roundDetails: IRoundDetail[]
}

export const LatestRoundsSchema = SchemaFactory.createForClass(LatestRounds);