import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LatestRounds, LatestRoundsDocument } from './latest-rounds.schema';

@Injectable()
export class LatestRoundsService {
  constructor(@InjectModel(LatestRounds.name) private readonly latestRoundsModel: Model<LatestRoundsDocument>) {}

  async findOne(): Promise<LatestRounds> {
    const count = await this.count();
    if (count === 0) {
      return null;
    }

    return await this.latestRoundsModel.findOne().exec();
  }

  private async count(): Promise<number> {
    let count = await this.latestRoundsModel.count();
    if (count === null || count === undefined) {
      return 0;
    }

    return count;
  }
}
