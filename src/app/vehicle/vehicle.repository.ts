import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { VEHICLE_COLLECTION } from '../../common/factory/vehicle.factory';
import { VehicleEntity } from './models/vehicle.entity';

@Injectable()
export class VehicleRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(VEHICLE_COLLECTION)
    private readonly collection: Collection<VehicleEntity>,
  ) {}

  async findOne(filter: Filter<VehicleEntity>, options?: FindOptions): Promise<VehicleEntity> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<VehicleEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<VehicleEntity>, options);
  }

  async find(filter: Filter<VehicleEntity>, options?: FindOptions): Promise<VehicleEntity[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: VehicleEntity): Promise<VehicleEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async count(filter: Filter<VehicleEntity>): Promise<number> {
    return this.collection.countDocuments(filter);
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<VehicleEntity>): Promise<VehicleEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<VehicleEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<VehicleEntity>);
  }
}
