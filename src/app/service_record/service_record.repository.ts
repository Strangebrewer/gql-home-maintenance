import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { SERVICE_RECORD_COLLECTION } from '../../common/factory/service_record.factory';
import { ServiceRecordEntity, ServiceRecordEntityRead, ServiceRecordType } from './models/service_record.entity';

@Injectable()
export class ServiceRecordRepository {
  private readonly primaryKey = 'id';

  constructor(
    @Inject(SERVICE_RECORD_COLLECTION)
    private readonly collection: Collection<ServiceRecordEntityRead>,
  ) {}

  async findOne(filter: Filter<ServiceRecordEntityRead>, options?: FindOptions): Promise<ServiceRecordEntityRead> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<ServiceRecordEntityRead> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<ServiceRecordEntityRead>, options);
  }

  async find(vehicleId: string, type?: ServiceRecordType, options?: FindOptions): Promise<ServiceRecordEntityRead[]> {
    const filter: Filter<ServiceRecordEntityRead> = { vehicleId };
    if (type) filter.type = type;
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: ServiceRecordEntity): Promise<ServiceRecordEntityRead> {
    const result = await this.collection.insertOne(entity as ServiceRecordEntityRead);
    return { _id: result.insertedId.toString(), ...entity };
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<ServiceRecordEntity>): Promise<ServiceRecordEntityRead> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<ServiceRecordEntityRead>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<ServiceRecordEntityRead>);
  }
}
