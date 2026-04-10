export type VehicleEntity = {
  id: string;
  thing: string;
  userId: string;
};

export type VehicleEntityRead = VehicleEntity & {
  _id?: string;
};
