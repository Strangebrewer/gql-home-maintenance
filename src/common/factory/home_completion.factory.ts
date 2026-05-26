import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from '../../config/database';
import { Collection, Db } from 'mongodb';
import { DB_CLIENT } from '../../shared/mongo/mongo.module';
import { HomeCompletionEntity } from '../../app/home_completion/models/home_completion.entity';

export const HOME_COMPLETION_COLLECTION = 'HOME_COMPLETION_COLLECTION';

export const HomeCompletionCollectionFactory = {
  provide: HOME_COMPLETION_COLLECTION,
  useFactory: (configService: ConfigService, db: Db): Collection<HomeCompletionEntity> => {
    const { collections } = configService.get<DatabaseConfig>('database');
    return db.collection(collections.homeCompletion);
  },
  inject: [ConfigService, DB_CLIENT],
};
