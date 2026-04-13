export type VehicleEntity = {
  id: string;
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
};

export type VehicleEntityRead = VehicleEntity & {
  _id?: string;
};
