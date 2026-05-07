export enum HomeTaskFrequency {
  MONTHLY = 'monthly',
  SEASONAL = 'seasonal',
  BI_ANNUAL = 'bi_annual',
  ANNUAL = 'annual',
  AS_NEEDED = 'as_needed',
}

export type HomeTaskEntity = {
  _id: string;
  userId: string;
  homeId: string;
  name: string;
  frequency: HomeTaskFrequency;
  description?: string;
  lastCompletionDate?: string;
};
