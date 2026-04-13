import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { HomeEntity } from '../../app/home/models/home.entity';

export const HOME_COLLECTION = 'HOME_COLLECTION';

export const HomeCollectionFactory = {
  provide: HOME_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<HomeEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.home);
  },
  inject: [ConfigService, DB_CLIENT],
};
