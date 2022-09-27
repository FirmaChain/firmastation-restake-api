import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatusesModule } from './statuses/statuses.module';
import { RoundsModule } from './rounds/rounds.module';
import { RestakeController } from './restake/restake.controller';
import { RestakeService } from './restake/restake.service';
import { MONGODB_URI } from './config';
import { LatestRoundsModule } from './latest-rounds/latest-rounds.module';
import { SchedulerService } from './scheduler/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

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
