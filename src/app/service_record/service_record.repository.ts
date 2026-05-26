import { Inject, Injectable } from '@nestjs/common';
import { Collection, Filter, FindOptions, ReturnDocument, UpdateFilter } from 'mongodb';
import { SERVICE_RECORD_COLLECTION } from '../../common/factory/service_record.factory';
import { ServiceRecordEntity, ServiceRecordType } from './models/service_record.entity';

@Injectable()
export class ServiceRecordRepository {
  private readonly primaryKey = '_id';

  constructor(
    @Inject(SERVICE_RECORD_COLLECTION)
    private readonly collection: Collection<ServiceRecordEntity>,
  ) {}

  async findOne(filter: Filter<ServiceRecordEntity>, options?: FindOptions): Promise<ServiceRecordEntity> {
    return this.collection.findOne(filter, options);
  }

  async findById(id: string, options?: FindOptions): Promise<ServiceRecordEntity> {
    return this.collection.findOne({ [this.primaryKey]: id } as Filter<ServiceRecordEntity>, options);
  }

  async find(vehicleId: string, type?: ServiceRecordType, options?: FindOptions): Promise<ServiceRecordEntity[]> {
    const filter: Filter<ServiceRecordEntity> = { vehicleId };
    if (type) filter.type = type;
    return this.collection.find(filter, options).toArray();
  }

  async create(entity: ServiceRecordEntity): Promise<ServiceRecordEntity> {
    await this.collection.insertOne(entity);
    return entity;
  }

  async count(filter: Filter<ServiceRecordEntity>): Promise<number> {
    return this.collection.countDocuments(filter);
  }

  async findOneAndUpdate(id: string, fields: UpdateFilter<ServiceRecordEntity>): Promise<ServiceRecordEntity> {
    return this.collection.findOneAndUpdate(
      { [this.primaryKey]: id } as Filter<ServiceRecordEntity>,
      { $set: fields },
      { returnDocument: ReturnDocument.AFTER },
    );
  }

  async deleteOne(id: string) {
    return this.collection.deleteOne({ [this.primaryKey]: id } as Filter<ServiceRecordEntity>);
  }
}
