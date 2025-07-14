import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LatestRounds, LatestRoundsSchema } from './latest-rounds.schema';
import { LatestRoundsService } from './latest-rounds.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: LatestRounds.name,
        useFactory: () => {
          const schema = LatestRoundsSchema;
          schema.pre('save', () => {
            console.log('Pre save at LatestRounds');
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [LatestRoundsService],
  exports: [LatestRoundsService],
})
export class LatestRoundsModule {}
