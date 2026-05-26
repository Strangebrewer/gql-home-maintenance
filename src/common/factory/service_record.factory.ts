import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { ServiceRecordEntity } from '../../app/service_record/models/service_record.entity';

export const SERVICE_RECORD_COLLECTION = 'SERVICE_RECORD_COLLECTION';

export const ServiceRecordCollectionFactory = {
  provide: SERVICE_RECORD_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<ServiceRecordEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.serviceRecord);
  },
  inject: [ConfigService, DB_CLIENT],
};
