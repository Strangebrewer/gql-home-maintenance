import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { HOME_TASK_COLLECTION } from '../../common/factory/home_task.factory';
import { HomeTaskEntity, HomeTaskFrequency } from './models/home_task.entity';

@Injectable()
export class HomeTaskRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(HOME_TASK_COLLECTION)
    private readonly collection: Collection<HomeTaskEntity>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<HomeTaskEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<HomeTaskEntity>, options);
  }

  async find(homeId: string, frequency?: HomeTaskFrequency, options?: FindOptions): Promise<HomeTaskEntity[]> {
    const filter: Filter<HomeTaskEntity> = { homeId };
    if (frequency) filter.frequency = frequency;
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: HomeTaskEntity): Promise<HomeTaskEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<HomeTaskEntity>): Promise<HomeTaskEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeTaskEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<HomeTaskEntity>);
  }
}
