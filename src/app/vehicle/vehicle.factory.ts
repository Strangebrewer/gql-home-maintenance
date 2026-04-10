import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { VehicleEntity } from './vehicle.entity';

export const VEHICLE_COLLECTION = 'VEHICLE_COLLECTION';

export const VehicleCollectionFactory = {
  provide: VEHICLE_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<VehicleEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.vehicle);
  },
  inject: [ConfigService, DB_CLIENT],
};
