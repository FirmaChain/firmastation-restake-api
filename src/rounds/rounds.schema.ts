import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IRoundDetail } from "src/interfaces/restake";

export type RoundsDocument = Rounds & Document;

@Schema()
export class Rounds {
  @Prop({ required: true })
  round: number;

  @Prop({ required: true })
  scheduleDate: string;

  @Prop({ required: true })
  roundDetails: IRoundDetail[]
}

export const RoundsSchema = SchemaFactory.createForClass(Rounds);