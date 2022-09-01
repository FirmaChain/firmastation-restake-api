import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { StatusesModule } from './statuses/statuses.module';
import { RoundsModule } from './rounds/rounds.module';
import { RestakeController } from './restake/restake.controller';
import { RestakeService } from './restake/restake.service';
import { MONGODB_URI } from './config';

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    StatusesModule,
    RoundsModule,
  ],
  controllers: [RestakeController],
  providers: [RestakeService],
})
export class AppModule {}
