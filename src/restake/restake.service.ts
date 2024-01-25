import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

import { MINIMUM_UFCT_REWARD_AMOUNT, RESTAKE_FREQUENCY, STATUS_ROUND_DATA_FILE_NAME } from 'src/config';

import {
  IDelegatorRewardInfo,
  IRestakeInfo,
  IRestakeStatus,
} from 'src/interfaces/restake';
import { LatestRoundsService } from 'src/latest-rounds/latest-rounds.service';

import { RoundsService } from 'src/rounds/rounds.service';
import { ScheduleDate } from 'src/utils/date';

@Injectable()
export class RestakeService {
  constructor(
    private readonly roundsService: RoundsService,
    private readonly latestRoundsService: LatestRoundsService
  ) { }

  getHealth(): string {
    return 'OK';
  }

  async getRestakeInfo(): Promise<IRestakeInfo> {
    let restakeInfo: IRestakeInfo = {
      frequency: RESTAKE_FREQUENCY,
      minimumRewards: MINIMUM_UFCT_REWARD_AMOUNT,
      round: 0,
      restakeAmount: '0',
      feesAmount: '0',
      restakeCount: 0,
      nextRoundDateTime: ScheduleDate().next()
    }

    let accRestakeAmount = 0;
    let accFeesAmount = 0;
    let accRestakeCount = 0;
    
    const publicPath = join(__dirname, '../..', 'public');
    const statusRoundDataFilePath = join(publicPath, STATUS_ROUND_DATA_FILE_NAME);

    if (fs.existsSync(statusRoundDataFilePath) === true) {
      const restakeStatusData: IRestakeStatus = JSON.parse(fs.readFileSync(statusRoundDataFilePath, 'utf-8'));
      const latestRound = restakeStatusData.roundDatas[0];

      const roundDetails = latestRound.roundDetails;
      for (let i = 0; i < roundDetails.length; i++) {
        const roundDetail = roundDetails[i];

        accRestakeAmount += roundDetail.restakeAmount;
        accFeesAmount += roundDetail.feesAmount;
        accRestakeCount += roundDetail.restakeCount;
      }

      restakeInfo.restakeAmount = Math.floor(accRestakeAmount).toString();
      restakeInfo.feesAmount = Math.floor(accFeesAmount).toString();
      restakeInfo.restakeCount = accRestakeCount;

      restakeInfo.round = latestRound.round;
    }

    return restakeInfo;
  }

  async getRestakeStatus(): Promise<IRestakeStatus> {
    const publicPath = join(__dirname, '../..', 'public');
    const statusRoundDataFilePath = join(publicPath, STATUS_ROUND_DATA_FILE_NAME);

    if (fs.existsSync(statusRoundDataFilePath) === false) {
      return {
        round: 0,
        feesAmount: 0,
        nextRoundDateTime: ScheduleDate().next(),
        restakeAmount: 0,
        restakeAvgTime: 0,
        restakeCount: 0,
        roundDatas: []
      };
    }

    const restakeStatusData: IRestakeStatus = JSON.parse(fs.readFileSync(statusRoundDataFilePath, 'utf-8'));
    return restakeStatusData;
  }

  async getDelegatorLatestRewardInfo(delegatorAddr: string): Promise<IDelegatorRewardInfo[]> {
    const latestRoundData = await this.latestRoundsService.findOne();
    if (latestRoundData === null) {
      return [];
    }

    const roundDetails = latestRoundData.roundDetails;
    if (roundDetails.length === 0) {
      return [];
    }

    let rewardInfos: IDelegatorRewardInfo[] = [];
    for (let i = 0; i < roundDetails.length; i++) {
      const roundDetail = roundDetails[i];
      const restakeTargets = roundDetail.finalRestakeTargets;
      
      if (restakeTargets.length === 0) {
        continue;
      }

      for (let j = 0; j < restakeTargets.length; j++) {
        const restakeTarget = restakeTargets[j];
        if (restakeTarget["delegatorAddr"] === delegatorAddr) {
          rewardInfos.push({
            validatorAddr: restakeTarget.validatorAddress,
            rewards: restakeTarget.rewards
          })
        }
      }
    }

    return rewardInfos;
  }
}
