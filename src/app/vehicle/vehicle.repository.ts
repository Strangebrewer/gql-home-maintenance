import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { VEHICLE_COLLECTION } from './vehicle.factory';
import { VehicleEntity, VehicleEntityRead } from './vehicle.entity';

@Injectable()
export class VehicleRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(VEHICLE_COLLECTION)
    private readonly collection: Collection<VehicleEntityRead>,
  ) {}

  async findOne(filter: Filter<VehicleEntityRead>, options?: FindOptions): Promise<VehicleEntityRead> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<VehicleEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<VehicleEntityRead>, options);
  }

  async find(filter: Filter<VehicleEntityRead>, options?: FindOptions): Promise<VehicleEntityRead[]> {
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: VehicleEntity): Promise<VehicleEntityRead> {
    const result = await this.collection.insertOne(entity as VehicleEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<VehicleEntity>): Promise<VehicleEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<VehicleEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<VehicleEntityRead>);
  }
}
