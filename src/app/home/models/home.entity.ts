export type HomeEntity = {
  id: string;
  userId: string;
  address: string;
  isPrimary: boolean;
  yearBuilt?: number;
  sqFootage?: number;
  notes?: string;
  customData?: string;
};

export type HomeEntityRead = HomeEntity & {
  _id?: string;
};
