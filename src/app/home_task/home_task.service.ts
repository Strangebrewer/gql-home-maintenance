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

@Injectable()
export class HomeTaskService {
  constructor(private readonly homeTaskRepository: HomeTaskRepository) {}

  async findById(id: string): Promise<HomeTask> {
    const record = await this.homeTaskRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Home task');
    }
    return mapToModel(record);
  }

  async find(
    homeId: string,
    frequency?: HomeTaskFrequency,
  ): Promise<HomeTask[]> {
    const records = await this.homeTaskRepository.find(homeId, frequency);
    return records.map(mapToModel);
  }

  async create(args: CreateHomeTaskArgs, userId: string): Promise<HomeTask> {
    const entity: HomeTaskEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.homeTaskRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateHomeTaskArgs): Promise<HomeTask> {
    const record = await this.homeTaskRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new NotFoundError('Home task');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.homeTaskRepository.deleteOne(id);
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
