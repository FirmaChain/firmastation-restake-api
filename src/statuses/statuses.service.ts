import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Statuses, StatusesDocument } from './statuses.schema';

@Injectable()
export class StatusesService {
  constructor(@InjectModel(Statuses.name) private readonly statusModel: Model<StatusesDocument>) {
  }

  async findOne(): Promise<Statuses> {
    let count = await this.count();

    if (count === 0) {
      return {
        nowRound: 0,
        restakeAmount: 0,
        feesAmount: 0,
        restakeCount: 0,
        nextRoundDateTime: ''
      }
    }

    return await this.statusModel.findOne().exec();
  }

  private async count(): Promise<number> {
    return await this.statusModel.count();
  }
}
