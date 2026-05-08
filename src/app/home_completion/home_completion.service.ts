import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { HomeTaskRepository } from '../home_task/home_task.repository';
import { HomeCompletionEntity } from './models/home_completion.entity';
import {
  CreateHomeCompletionArgs,
  HomeCompletion,
  UpdateHomeCompletionArgs,
} from './models/home_completion.model';
import { HomeCompletionRepository } from './home_completion.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from 'src/shared/tracer/tracer.module';

@Injectable()
export class HomeCompletionService {
  constructor(
    private readonly homeCompletionRepository: HomeCompletionRepository,
    private readonly homeTaskRepository: HomeTaskRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<HomeCompletion> {
    const start = new Date();
    const op = `find_home_completion by id: ${id}`;
    const record = await this.homeCompletionRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home completion not found', start, end);
      throw new NotFoundError('Home completion');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async findByTask(
    taskId: string,
    traceId?: string,
  ): Promise<HomeCompletion[]> {
    const start = new Date();
    const op = `find_home_completions by task: ${taskId}`;
    const records = await this.homeCompletionRepository.find({ taskId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async findByHome(
    homeId: string,
    traceId?: string,
  ): Promise<HomeCompletion[]> {
    const start = new Date();
    const op = `find_home_completions by home: ${homeId}`;
    const records = await this.homeCompletionRepository.find({ homeId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(
    args: CreateHomeCompletionArgs,
    userId: string,
    traceId?: string,
  ): Promise<HomeCompletion> {
    const start = new Date();
    const op = 'create_home_completion';
    const task = await this.homeTaskRepository.findById(args.taskId);
    if (!task) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home task not found', start, end);
      throw new NotFoundError('Home task');
    }

    const entity: HomeCompletionEntity = {
      ...args,
      userId,
      homeId: task.homeId,
      _id: randomUUID(),
    };
    const record = await this.homeCompletionRepository.create(entity);

    if (!task.lastCompletionDate || args.date > task.lastCompletionDate) {
      await this.homeTaskRepository.findOneAndUpdate(args.taskId, {
        lastCompletionDate: args.date,
      });
    }

    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(
    id: string,
    args: UpdateHomeCompletionArgs,
    traceId?: string,
  ): Promise<HomeCompletion> {
    const start = new Date();
    const op = `update_home_completion by id: ${id}`;
    const record = await this.homeCompletionRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home completion not found', start, end);
      throw new NotFoundError('Home completion');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_home_completion by id: ${id}`;
    const completion = await this.homeCompletionRepository.findById(id);
    if (!completion) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Home completion not found', start, end);
      throw new NotFoundError('Home completion');
    }

    const result = await this.homeCompletionRepository.deleteOne(id);

    const mostRecent = await this.homeCompletionRepository.findMostRecentByTask(
      completion.taskId,
    );
    await this.homeTaskRepository.findOneAndUpdate(completion.taskId, {
      lastCompletionDate: mostRecent?.date ?? null,
    });

    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return result;
  }
}

function mapToModel(entity: HomeCompletionEntity): HomeCompletion {
  return {
    id: entity._id,
    userId: entity.userId,
    homeId: entity.homeId,
    taskId: entity.taskId,
    date: entity.date,
    cost: entity.cost,
    notes: entity.notes,
  };
}
