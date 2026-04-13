import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { HOME_TASK_COLLECTION } from '../../common/factory/home_task.factory';
import { HomeTaskEntity, HomeTaskEntityRead, HomeTaskFrequency } from './models/home_task.entity';

@Injectable()
export class HomeTaskRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(HOME_TASK_COLLECTION)
    private readonly collection: Collection<HomeTaskEntityRead>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<HomeTaskEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<HomeTaskEntityRead>, options);
  }

  async find(homeId: string, frequency?: HomeTaskFrequency, options?: FindOptions): Promise<HomeTaskEntityRead[]> {
    const filter: Filter<HomeTaskEntityRead> = { homeId };
    if (frequency) filter.frequency = frequency;
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: HomeTaskEntity): Promise<HomeTaskEntityRead> {
    const result = await this.collection.insertOne(entity as HomeTaskEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<HomeTaskEntity>): Promise<HomeTaskEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeTaskEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<HomeTaskEntityRead>);
  }
}
