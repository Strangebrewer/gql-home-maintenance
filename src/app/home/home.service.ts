import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { HomeEntity } from './models/home.entity';
import { CreateHomeArgs, Home, UpdateHomeArgs } from './models/home.model';
import { HomeRepository } from './home.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';

@Injectable()
export class HomeService {
  constructor(
    private readonly homeRepository: HomeRepository,
    @Inject(TRACER_CLIENT)
    private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<Home> {
    const start = new Date();
    const op = `find_home by id: ${id}`;
    const record = await this.homeRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home not found', start, end);
      throw new NotFoundError('Home');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async find(userId: string, traceId?: string): Promise<Home[]> {
    const start = new Date();
    const op = 'find_homes';
    const records = await this.homeRepository.find({ userId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(
    args: CreateHomeArgs,
    userId: string,
    traceId?: string,
  ): Promise<Home> {
    const start = new Date();
    const op = 'create_home';
    const existing = await this.homeRepository.find({ userId });
    const entity: HomeEntity = {
      ...args,
      userId,
      isPrimary: existing.length === 0,
      _id: randomUUID(),
    };
    const record = await this.homeRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async setPrimaryHome(
    id: string,
    userId: string,
    traceId?: string,
  ): Promise<Home> {
    const start = new Date();
    const op = `set_primary_home by id: ${id}`;
    const record = await this.homeRepository.setPrimary(id, userId);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home not found', start, end);
      throw new NotFoundError('Home');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(
    id: string,
    args: UpdateHomeArgs,
    traceId?: string,
  ): Promise<Home> {
    const start = new Date();
    const op = `update_home by id: ${id}`;
    const record = await this.homeRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home not found', start, end);
      throw new NotFoundError('Home');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_home by id: ${id}`;
    const result = await this.homeRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
  }
}

function mapToModel(entity: HomeEntity): Home {
  return {
    id: entity._id,
    userId: entity.userId,
    address: entity.address,
    isPrimary: entity.isPrimary,
    yearBuilt: entity.yearBuilt,
    sqFootage: entity.sqFootage,
    notes: entity.notes,
    customData: entity.customData,
  };
}
