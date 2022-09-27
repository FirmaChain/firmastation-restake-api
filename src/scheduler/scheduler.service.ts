import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import { join } from 'path';
import { STATUS_ROUND_DATA_FILE_NAME } from 'src/config';
import { IRestakeRoundData, IRestakeStatus, IRoundDetail } from 'src/interfaces/restake';

import { RoundsService } from 'src/rounds/rounds.service';
import { StatusesService } from 'src/statuses/statuses.service';
import { ScheduleDate } from 'src/utils/date';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly statusesService: StatusesService,
    private readonly roundsService: RoundsService
  ) { 
    this.handleCron();
  }
  private statusRoundData: IRestakeStatus;

  @Cron("*/2 * * * *", {
    name: 'restake_data_handling',
    timeZone: 'Etc/UTC'
  })
  async handleCron() {
    // file
    this.fileCheck();
    // get restake data at db
    await this.setRestakeData();
  }

  fileCheck() {
    const publicPath = join(__dirname, '../..', 'public');
    const statusRoundDataFilePath = join(publicPath, STATUS_ROUND_DATA_FILE_NAME);

    const isDirExists = fs.existsSync(publicPath) && fs.lstatSync(publicPath).isDirectory();
    if (isDirExists === false) {
      fs.mkdirSync(publicPath);
    }

    const isRoundJsonExists = fs.existsSync(statusRoundDataFilePath) && fs.lstatSync(statusRoundDataFilePath).isFile();
    if (isRoundJsonExists === false) {
      let restakeStatus = {
        round: 0,
        restakeAmount: 0,
        feesAmount: 0,
        restakeCount: 0,
        restakeAvgTime: 0,
        nextRoundDateTime: ScheduleDate().next(),
        roundDatas: []
      }
      fs.writeFileSync(statusRoundDataFilePath, JSON.stringify(restakeStatus), 'utf-8');
    }

    this.statusRoundData = JSON.parse(fs.readFileSync(statusRoundDataFilePath, 'utf-8'));
  }

  async setRestakeData() {
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
      return;
    }

    if (this.statusRoundData.round === statusData.nowRound) {
      return ;
    }

    restakeStatus.round = statusData.nowRound;
    restakeStatus.restakeAmount = statusData.restakeAmount;
    restakeStatus.feesAmount = statusData.feesAmount;
    restakeStatus.restakeCount = statusData.restakeCount;

    const roundDatas = await this.roundsService.findAll();
    if (roundDatas.length === 0) {
      return restakeStatus;
    }

    for (let i = roundDatas.length - 1; i >= 0; i--) {
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
        const startDateTime = new Date(roundData.scheduleDate).getTime();
        const endDateTime = new Date(roundData.roundDetails[roundDetailLength - 1].dateTime).getTime();
        roundRestakeTotalTime = (endDateTime - startDateTime) / 1000;

        if (i > roundDatas.length - 11) {
          console.log(1);
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

    const publicPath = join(__dirname, '../..', 'public');
    const statusRoundDataFilePath = join(publicPath, STATUS_ROUND_DATA_FILE_NAME);

    console.log('write file');
    fs.writeFileSync(statusRoundDataFilePath, JSON.stringify(restakeStatus))
  }
}
