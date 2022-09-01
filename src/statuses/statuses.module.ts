import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Statuses, StatusesSchema } from './statuses.schema';
import { StatusesService } from './statuses.service';

@Module({
  imports: [MongooseModule.forFeatureAsync([
    {
      name: Statuses.name,
      useFactory: () => {
        return StatusesSchema;
      }
    }
  ])],
  providers: [StatusesService],
  exports: [StatusesService]
})
export class StatusesModule {}
