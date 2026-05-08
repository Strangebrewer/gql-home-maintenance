import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import {
  ServiceRecordEntity,
  ServiceRecordType,
} from './models/service_record.entity';
import {
  CreateServiceRecordArgs,
  ServiceRecord,
  UpdateServiceRecordArgs,
} from './models/service_record.model';
import { ServiceRecordRepository } from './service_record.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';

@Injectable()
export class ServiceRecordService {
  constructor(
    private readonly serviceRecordRepository: ServiceRecordRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<ServiceRecord> {
    const start = new Date();
    const op = `find_service_record by id: ${id}`;
    const record = await this.serviceRecordRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(
        traceId,
        op,
        'Service record not found',
        start,
        end,
      );
      throw new NotFoundError('Service record');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async find(
    vehicleId: string,
    type?: ServiceRecordType,
    traceId?: string,
  ): Promise<ServiceRecord[]> {
    const start = new Date();
    const op = 'find_service_records';
    const records = await this.serviceRecordRepository.find(vehicleId, type);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(
    args: CreateServiceRecordArgs,
    userId: string,
    traceId?: string,
  ): Promise<ServiceRecord> {
    const start = new Date();
    const op = 'create_service_record';
    const entity: ServiceRecordEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.serviceRecordRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(
    id: string,
    args: UpdateServiceRecordArgs,
    traceId?: string,
  ): Promise<ServiceRecord> {
    const start = new Date();
    const op = `update_service_record by id: ${id}`;
    const record = await this.serviceRecordRepository.findOneAndUpdate(
      id,
      args,
    );
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(
        traceId,
        op,
        'Service record not found',
        start,
        end,
      );
      throw new NotFoundError('Service record');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_service_record by id: ${id}`;
    const result = await this.serviceRecordRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
  }
}

function mapToModel(entity: ServiceRecordEntity): ServiceRecord {
  return {
    id: entity._id,
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
