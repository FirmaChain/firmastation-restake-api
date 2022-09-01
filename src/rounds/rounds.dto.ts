import { IRoundDetail } from "src/interfaces/restake";

export class RoundsDto {
  readonly round: number;
  readonly scheduleDate: string;
  readonly roundDetails: IRoundDetail[]
}