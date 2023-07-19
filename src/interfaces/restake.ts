export interface IRestakeInfo {
  frequency: string;
  minimumRewards: number;
  round: number;
  feesAmount: string;
  restakeAmount: string;
  restakeCount: number;
  nextRoundDateTime: string;
}

export interface IDelegatorRewardInfo {
  validatorAddr: string;
  rewards: number;
}

export interface IRestakeStatus {
  round: number;
  feesAmount: number;
  restakeAmount: number;
  restakeCount: number;
  restakeAvgTime: number;
  nextRoundDateTime: string;
  roundDatas: IRestakeRoundData[];
}

export interface IRestakeRoundData {
  round: number;
  startDateTime: string;
  restakeAmount: number;
  feesAmount: number;
  restakeCount: number;
  restakeTotalTime: number;
  roundDetails: IRoundDetail[];
}

export interface IRoundDetail {
  restakeAmount: number;
  feesAmount: number;
  restakeCount: number;
  dateTime: string;
  txHash: string;
  reason?: number;
  originRestakeTargets?: IRestakeTarget[];
  finalRestakeTargets?: IRestakeTarget[];
}

export interface IRestakeTarget {
  validatorAddress: string;
  delegatorAddress: string;
  rewards: number;
}