import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { HOME_COMPLETION_COLLECTION } from '../../common/factory/home_completion.factory';
import { HomeCompletionEntity, HomeCompletionEntityRead } from './models/home_completion.entity';

@Injectable()
export class HomeCompletionRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(HOME_COMPLETION_COLLECTION)
    private readonly collection: Collection<HomeCompletionEntityRead>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<HomeCompletionEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<HomeCompletionEntityRead>, options);
  }

  async find(filter: Filter<HomeCompletionEntityRead>, options?: FindOptions): Promise<HomeCompletionEntityRead[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: HomeCompletionEntity): Promise<HomeCompletionEntityRead> {
    const result = await this.collection.insertOne(entity as HomeCompletionEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<HomeCompletionEntity>): Promise<HomeCompletionEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeCompletionEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async findMostRecentByTask(taskId: string): Promise<HomeCompletionEntityRead | null> {
    const results = await this.collection
      .find({ taskId } as Filter<HomeCompletionEntityRead>)
      .sort({ date: -1 })
      .limit(1)
      .toArray();
    return results[0] ?? null;
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<HomeCompletionEntityRead>);
  }
}
