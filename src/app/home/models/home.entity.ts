export type HomeEntity = {
  _id: string;
  userId: string;
  address: string;
  isPrimary: boolean;
  yearBuilt?: number;
  sqFootage?: number;
  notes?: string;
  customData?: string;
};
