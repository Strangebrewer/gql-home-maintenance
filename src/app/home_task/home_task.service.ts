import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { HomeTaskEntity, HomeTaskFrequency } from './models/home_task.entity';
import { CreateHomeTaskArgs, HomeTask, UpdateHomeTaskArgs } from './models/home_task.model';
import { HomeTaskRepository } from './home_task.repository';

@Injectable()
export class HomeTaskService {
  constructor(
    private readonly homeTaskRepository: HomeTaskRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<HomeTask> {
    const record = await this.homeTaskRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Home task not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async find(homeId: string, frequency?: HomeTaskFrequency): Promise<HomeTask[]> {
    const records = await this.homeTaskRepository.find(homeId, frequency);
    return records.map(mapToModel);
  }

  async create(args: CreateHomeTaskArgs, userId: string): Promise<HomeTask> {
    const entity: HomeTaskEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('TSK'),
    };
    const record = await this.homeTaskRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateHomeTaskArgs): Promise<HomeTask> {
    const record = await this.homeTaskRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Home task not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.homeTaskRepository.deleteOne(id);
  }
}

function mapToModel(entity: HomeTaskEntity): HomeTask {
  return {
    id: entity.id,
    userId: entity.userId,
    homeId: entity.homeId,
    name: entity.name,
    frequency: entity.frequency,
    description: entity.description,
  };
}
