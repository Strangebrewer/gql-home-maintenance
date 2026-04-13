import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { ServiceRecordEntity, ServiceRecordType } from './models/service_record.entity';
import { CreateServiceRecordArgs, ServiceRecord, UpdateServiceRecordArgs } from './models/service_record.model';
import { ServiceRecordRepository } from './service_record.repository';

@Injectable()
export class ServiceRecordService {
  constructor(
    private readonly serviceRecordRepository: ServiceRecordRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<ServiceRecord> {
    const record = await this.serviceRecordRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Service record not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async find(vehicleId: string, type?: ServiceRecordType): Promise<ServiceRecord[]> {
    const records = await this.serviceRecordRepository.find(vehicleId, type);
    return records.map(mapToModel);
  }

  async create(args: CreateServiceRecordArgs, userId: string): Promise<ServiceRecord> {
    const entity: ServiceRecordEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('SVC'),
    };
    const record = await this.serviceRecordRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateServiceRecordArgs): Promise<ServiceRecord> {
    const record = await this.serviceRecordRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Service record not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.serviceRecordRepository.deleteOne(id);
  }
}

function mapToModel(entity: ServiceRecordEntity): ServiceRecord {
  return {
    id: entity.id,
    userId: entity.userId,
    vehicleId: entity.vehicleId,
    type: entity.type,
    date: entity.date,
    mileage: entity.mileage,
    cost: entity.cost,
    name: entity.name,
    description: entity.description,
  };
}
