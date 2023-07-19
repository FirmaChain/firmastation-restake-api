import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { StatusesModule } from './statuses/statuses.module';
import { LatestRoundsModule } from './latest-rounds/latest-rounds.module';
import { RoundsModule } from './rounds/rounds.module';

import { RestakeController } from './restake/restake.controller';

import { RestakeService } from './restake/restake.service';
import { SchedulerService } from './scheduler/scheduler.service';

import { MONGODB_URI } from './config';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(MONGODB_URI),
    StatusesModule,
    RoundsModule,
    LatestRoundsModule,
  ],
  controllers: [RestakeController],
  providers: [RestakeService, SchedulerService],
})
export class AppModule {}
