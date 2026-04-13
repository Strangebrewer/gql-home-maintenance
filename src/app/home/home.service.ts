import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { HomeEntity } from './models/home.entity';
import { CreateHomeArgs, Home, UpdateHomeArgs } from './models/home.model';
import { HomeRepository } from './home.repository';

@Injectable()
export class HomeService {
  constructor(
    private readonly homeRepository: HomeRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<Home> {
    const record = await this.homeRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Home not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Home[]> {
    const records = await this.homeRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateHomeArgs, userId: string): Promise<Home> {
    const entity: HomeEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('HOM'),
    };
    const record = await this.homeRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateHomeArgs): Promise<Home> {
    const record = await this.homeRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Home not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.homeRepository.deleteOne(id);
  }
}

function mapToModel(entity: HomeEntity): Home {
  return {
    id: entity.id,
    userId: entity.userId,
    address: entity.address,
    yearBuilt: entity.yearBuilt,
    sqFootage: entity.sqFootage,
    notes: entity.notes,
  };
}
