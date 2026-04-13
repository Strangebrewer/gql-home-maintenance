import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { HomeTaskEntity } from '../../app/home_task/models/home_task.entity';

export const HOME_TASK_COLLECTION = 'HOME_TASK_COLLECTION';

export const HomeTaskCollectionFactory = {
  provide: HOME_TASK_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<HomeTaskEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.homeTask);
  },
  inject: [ConfigService, DB_CLIENT],
};
