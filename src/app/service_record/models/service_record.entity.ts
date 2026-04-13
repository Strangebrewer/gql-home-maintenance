export enum ServiceRecordType {
  OIL_CHANGE = 'oil_change',
  TIRE_ROTATION = 'tire_rotation',
  SERVICE_ITEM = 'service_item',
}

export type ServiceRecordEntity = {
  id: string;
  userId: string;
  vehicleId: string;
  type: ServiceRecordType;
  date: string;
  mileage: number;
  cost?: number;
  name?: string;
  description?: string;
};

export type ServiceRecordEntityRead = ServiceRecordEntity & {
  _id?: string;
};
