import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Rounds, RoundsDocument } from './rounds.schema';

@Injectable()
export class RoundsService {
  constructor(@InjectModel(Rounds.name) private readonly roundsModel: Model<RoundsDocument>) {
  }

  async findAllReverse(): Promise<Rounds[]> {
    let count = await this.count();
    if (count === 0) {
      return [];
    }

    const rounds = await this.roundsModel.find().sort({ round: -1});
    return rounds;
  }

  async findLatest(): Promise<Rounds> {
    let count = await this.count();
    if (count === 0) {
      return null;
    }

    const roundData = await this.roundsModel.find().sort({ round: -1 }).limit(1);
    return roundData[0];
  }

  async findOne(round: number): Promise<Rounds> {
    let count = await this.count();
    if (count === 0) {
      return null;
    }

    return await this.roundsModel.findOne({ round: round }).exec();
  }

  private async count(): Promise<number> {
    return await this.roundsModel.count();
  }
}
