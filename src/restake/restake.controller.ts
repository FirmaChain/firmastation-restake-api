import { Controller, Get, Param } from '@nestjs/common';

import {
  IDelegatorRewardInfo,
  IRestakeInfo,
  IRestakeStatus,
} from 'src/interfaces/restake';
import { RestakeService } from './restake.service';

@Controller('restake')
export class RestakeController {
  constructor(private readonly restakeService: RestakeService) {}

  @Get('health')
  getHealth() {
    return this.restakeService.getHealth();
  }

  @Get('info')
  async getRestakeInfo(): Promise<IRestakeInfo> {
    return await this.restakeService.getRestakeInfo();
  }

  @Get('status')
  async getRestakeStatus(): Promise<IRestakeStatus> {
    return await this.restakeService.getRestakeStatus();
  }

  @Get('reward/:delegatorAddr')
  async getDelegatorLatestRewardInfo(
    @Param('delegatorAddr') delegatorAddr: string,
  ): Promise<IDelegatorRewardInfo[]> {
    return await this.restakeService.getDelegatorLatestRewardInfo(
      delegatorAddr,
    );
  }
}
