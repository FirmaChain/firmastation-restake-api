import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Rounds, RoundsSchema } from './rounds.schema';
import { RoundsService } from './rounds.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Rounds.name,
        useFactory: () => {
          return RoundsSchema;
        },
      },
    ]),
  ],
  providers: [RoundsService],
  exports: [RoundsService],
})
export class RoundsModule {}
