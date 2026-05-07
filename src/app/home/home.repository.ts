import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { HOME_COLLECTION } from '../../common/factory/home.factory';
import { HomeEntity } from './models/home.entity';

@Injectable()
export class HomeRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(HOME_COLLECTION)
    private readonly collection: Collection<HomeEntity>,
  ) {}

  async findById(id: string, options?: FindOptions): Promise<HomeEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<HomeEntity>, options);
  }

  async find(filter: Filter<HomeEntity>, options?: FindOptions): Promise<HomeEntity[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: HomeEntity): Promise<HomeEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<HomeEntity>): Promise<HomeEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async setPrimary(id: string, userId: string): Promise<HomeEntity> {
    await this.collection.updateMany(
      { userId } as Filter<HomeEntity>,
      { $set: { isPrimary: false } },
    );
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<HomeEntity>,
      { $set: { isPrimary: true } },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<HomeEntity>);
  }
}
