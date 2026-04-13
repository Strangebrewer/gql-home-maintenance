export type HomeEntity = {
  id: string;
  userId: string;
  address: string;
  yearBuilt?: number;
  sqFootage?: number;
  notes?: string;
};

export type HomeEntityRead = HomeEntity & {
  _id?: string;
};
