import { Injectable } from '@nestjs/common';
import { MINIMUM_UFCT_REWARD_AMOUNT, RESTAKE_FREQUENCY } from 'src/config';

import { IDelegatorRewardInfo, IRestakeInfo, IRestakeRoundData, IRestakeStatus, IRoundDetail } from 'src/interfaces/restake';
import { LatestRoundsService } from 'src/latest-rounds/latest-rounds.service';

import { RoundsService } from 'src/rounds/rounds.service';
import { StatusesService } from 'src/statuses/statuses.service';
import { ScheduleDate } from 'src/utils/date';

@Injectable()
export class RestakeService {
  constructor(
    private readonly roundsService: RoundsService,
    private readonly statusesService: StatusesService,
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

    const latestRound = await this.roundsService.findLatest();
    if (latestRound !== null) {

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
    let restakeStatus: IRestakeStatus = {
      round: 0,
      restakeAmount: 0,
      feesAmount: 0,
      restakeCount: 0,
      restakeAvgTime: 0,
      nextRoundDateTime: ScheduleDate().next(),
      roundDatas: []
    }
    let restakeTotalTime = 0;

    const statusData = await this.statusesService.findOne();
    if (statusData === null || statusData === undefined) {
      return restakeStatus;
    }

    restakeStatus.round = statusData.nowRound;
    restakeStatus.restakeAmount = statusData.restakeAmount;
    restakeStatus.feesAmount = statusData.feesAmount;
    restakeStatus.restakeCount = statusData.restakeCount;

    const roundDatas = await this.roundsService.findAllReverse();
    if (roundDatas.length === 0) {
      return restakeStatus;
    } else {

      for (let i = 0; i < roundDatas.length; i++) {
        const roundData = roundDatas[i];
        let roundRestakeAmount = 0;
        let roundFeesAmount = 0;
        let roundRestakeCount = 0;
        let roundRestakeTotalTime = 0;
        let roundDetails: IRoundDetail[] = [];
        let roundDetailLength = roundData.roundDetails.length;

        for (let j = 0; j < roundDetailLength; j++) {
          const roundDetail = roundData.roundDetails[j];
          if (roundDetail.reason === 0) {
            roundRestakeAmount += roundDetail.restakeAmount;
            roundFeesAmount += roundDetail.feesAmount;
            roundRestakeCount += roundDetail.restakeCount;

            roundDetails.push({
              txHash: roundDetail.txHash,
              restakeAmount: roundDetail.restakeAmount,
              feesAmount: roundDetail.feesAmount,
              restakeCount: roundDetail.restakeCount,
              dateTime: roundDetail.dateTime
            });
          }
        }

        if (roundDetailLength > 0) {
          const startDateTime = (new Date(roundData.scheduleDate)).getTime();
          const endDateTime = (new Date(roundData.roundDetails[roundDetailLength - 1].dateTime)).getTime();
          roundRestakeTotalTime = (endDateTime - startDateTime) / 1000;

          if (i < 10) {
            restakeTotalTime += roundRestakeTotalTime;
          }
        }

        const restakeRoundData: IRestakeRoundData = {
          round: roundData.round,
          startDateTime: roundData.scheduleDate,
          restakeAmount: roundRestakeAmount,
          feesAmount: roundFeesAmount,
          restakeCount: roundRestakeCount,
          restakeTotalTime: Number(roundRestakeTotalTime.toFixed(2)),
          roundDetails: roundDetails
        }

        restakeStatus.roundDatas.push(restakeRoundData);
      }

      let restakeAvgTime = restakeTotalTime / (roundDatas.length <= 10 ? roundDatas.length : 10);
      restakeStatus.restakeAvgTime = Number(restakeAvgTime.toFixed(2));
    }

    return restakeStatus;
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
      const restakeTargets = roundDetail.originRestakeTargets;
      if (restakeTargets.length === 0) {
        continue;
      }

      for (let j = 0; j < restakeTargets.length; j++) {
        const restakeTarget = restakeTargets[j];
        if (restakeTarget.delegatorAddr === delegatorAddr) {
          rewardInfos.push({
            validatorAddr: restakeTarget.validatorAddr,
            rewards: restakeTarget.rewards
          })
        }
      }
    }

    return rewardInfos;
  }
}
