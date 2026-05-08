import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { HomeTaskEntity, HomeTaskFrequency } from './models/home_task.entity';
import {
  CreateHomeTaskArgs,
  HomeTask,
  UpdateHomeTaskArgs,
} from './models/home_task.model';
import { HomeTaskRepository } from './home_task.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from 'src/shared/tracer/tracer.module';

@Injectable()
export class HomeTaskService {
  constructor(
    private readonly homeTaskRepository: HomeTaskRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<HomeTask> {
    const start = new Date();
    const op = `find_home_task by id: ${id}`;
    const record = await this.homeTaskRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home task not found', start, end);
      throw new NotFoundError('Home task');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async find(
    homeId: string,
    frequency?: HomeTaskFrequency,
    traceId?: string,
  ): Promise<HomeTask[]> {
    const start = new Date();
    const op = 'find_home_tasks';
    const records = await this.homeTaskRepository.find(homeId, frequency);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(
    args: CreateHomeTaskArgs,
    userId: string,
    traceId?: string,
  ): Promise<HomeTask> {
    const start = new Date();
    const op = 'create_home_task';
    const entity: HomeTaskEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.homeTaskRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(
    id: string,
    args: UpdateHomeTaskArgs,
    traceId?: string,
  ): Promise<HomeTask> {
    const start = new Date();
    const op = `update_home_task by id: ${id}`;
    const record = await this.homeTaskRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home task not found', start, end);
      throw new NotFoundError('Home task');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_home_task by id: ${id}`;
    const result = await this.homeTaskRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
  }
}

function mapToModel(entity: HomeTaskEntity): HomeTask {
  return {
    id: entity._id,
    userId: entity.userId,
    homeId: entity.homeId,
    name: entity.name,
    frequency: entity.frequency,
    description: entity.description,
    lastCompletionDate: entity.lastCompletionDate,
  };
}
