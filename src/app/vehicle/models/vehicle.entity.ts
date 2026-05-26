export type VehicleEntity = {
  _id: string;
  userId: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  color?: string;
  trim?: string;
  plate?: string;
  vin?: string;
  insuranceId?: string;
  expiresAt?: Date;
};
