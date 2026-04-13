import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { HomeTaskRepository } from '../home_task/home_task.repository';
import { HomeCompletionEntity } from './models/home_completion.entity';
import { CreateHomeCompletionArgs, HomeCompletion, UpdateHomeCompletionArgs } from './models/home_completion.model';
import { HomeCompletionRepository } from './home_completion.repository';

@Injectable()
export class HomeCompletionService {
  constructor(
    private readonly homeCompletionRepository: HomeCompletionRepository,
    private readonly homeTaskRepository: HomeTaskRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<HomeCompletion> {
    const record = await this.homeCompletionRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Home completion not found', {
        extensions: { code: 404 },
      });
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

  async create(args: CreateHomeCompletionArgs, userId: string): Promise<HomeCompletion> {
    const task = await this.homeTaskRepository.findById(args.taskId);
    if (!task) {
      throw new GraphQLError('Home task not found', {
        extensions: { code: 404 },
      });
    }

    const entity: HomeCompletionEntity = {
      ...args,
      userId,
      homeId: task.homeId,
      id: this.idGenerator.generate('CMP'),
    };
    const record = await this.homeCompletionRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateHomeCompletionArgs): Promise<HomeCompletion> {
    const record = await this.homeCompletionRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Home completion not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.homeCompletionRepository.deleteOne(id);
  }
}

function mapToModel(entity: HomeCompletionEntity): HomeCompletion {
  return {
    id: entity.id,
    userId: entity.userId,
    homeId: entity.homeId,
    taskId: entity.taskId,
    date: entity.date,
    cost: entity.cost,
    notes: entity.notes,
  };
}
