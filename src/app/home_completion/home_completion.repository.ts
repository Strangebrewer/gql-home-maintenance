import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { HOME_COMPLETION_COLLECTION } from '../../common/factory/home_completion.factory';
import { HomeCompletionEntity } from './models/home_completion.entity';

@Injectable()
export class HomeCompletionRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(HOME_COMPLETION_COLLECTION)
    private readonly collection: Collection<HomeCompletionEntity>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<HomeCompletionEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<HomeCompletionEntity>, options);
  }

  async find(filter: Filter<HomeCompletionEntity>, options?: FindOptions): Promise<HomeCompletionEntity[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: HomeCompletionEntity): Promise<HomeCompletionEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async count(filter: Filter<HomeCompletionEntity>): Promise<number> {
    return this.collection.countDocuments(filter);
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<HomeCompletionEntity>): Promise<HomeCompletionEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeCompletionEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async findMostRecentByTask(taskId: string): Promise<HomeCompletionEntity | null> {
    const results = await this.collection
      .find({ taskId } as Filter<HomeCompletionEntity>)
      .sort({ date: -1 })
      .limit(1)
      .toArray();
    return results[0] ?? null;
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<HomeCompletionEntity>);
  }
}
