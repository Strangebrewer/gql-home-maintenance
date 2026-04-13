import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { HOME_COLLECTION } from '../../common/factory/home.factory';
import { HomeEntity, HomeEntityRead } from './models/home.entity';

@Injectable()
export class HomeRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(HOME_COLLECTION)
    private readonly collection: Collection<HomeEntityRead>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<HomeEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<HomeEntityRead>, options);
  }

  async find(filter: Filter<HomeEntityRead>, options?: FindOptions): Promise<HomeEntityRead[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: HomeEntity): Promise<HomeEntityRead> {
    const result = await this.collection.insertOne(entity as HomeEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<HomeEntity>): Promise<HomeEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<HomeEntityRead>);
  }
}
