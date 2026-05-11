import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { HomeTaskRepository } from '../home_task/home_task.repository';
import { HomeCompletionEntity } from './models/home_completion.entity';
import {
  CreateHomeCompletionInput,
  HomeCompletion,
  UpdateHomeCompletionInput,
} from './models/home_completion.model';
import { HomeCompletionRepository } from './home_completion.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class HomeCompletionService {
  constructor(
    private readonly homeCompletionRepository: HomeCompletionRepository,
    private readonly homeTaskRepository: HomeTaskRepository,
  ) {}

  async findById(id: string): Promise<HomeCompletion> {
    const record = await this.homeCompletionRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Home completion');
    }
    return mapToModel(record);
  }

  async findByTask(taskId: string): Promise<HomeCompletion[]> {
    const records = await this.homeCompletionRepository.find({ taskId });
    return records.map(mapToModel);
  }

  async findByHome(homeId: string): Promise<HomeCompletion[]> {
    const records = await this.homeCompletionRepository.find({ homeId });
    return records.map(mapToModel);
  }

  async create(
    args: CreateHomeCompletionInput,
    userId: string,
  ): Promise<HomeCompletion> {
    const task = await this.homeTaskRepository.findById(args.taskId);
    if (!task) {
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

    return mapToModel(record);
  }

  async update(
    id: string,
    args: UpdateHomeCompletionInput,
  ): Promise<HomeCompletion> {
    const record = await this.homeCompletionRepository.findOneAndUpdate(
      id,
      args,
    );
    if (!record) {
      throw new NotFoundError('Home completion');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    const completion = await this.homeCompletionRepository.findById(id);
    if (!completion) {
      throw new NotFoundError('Home completion');
    }

    const result = await this.homeCompletionRepository.deleteOne(id);

    const mostRecent = await this.homeCompletionRepository.findMostRecentByTask(
      completion.taskId,
    );
    await this.homeTaskRepository.findOneAndUpdate(completion.taskId, {
      lastCompletionDate: mostRecent?.date ?? null,
    });

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
