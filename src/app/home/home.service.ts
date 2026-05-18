import { randomUUID } from 'crypto';
import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { HomeEntity } from './models/home.entity';
import { CreateHomeInput, Home, UpdateHomeInput } from './models/home.model';
import { HomeRepository } from './home.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class HomeService {
  constructor(private readonly homeRepository: HomeRepository) {}

  async findById(id: string): Promise<Home> {
    const record = await this.homeRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Home');
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Home[]> {
    const records = await this.homeRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateHomeInput, userId: string, options?: { isDemo?: boolean; expiresAt?: Date }): Promise<Home> {
    if (options?.isDemo) {
      const count = await this.homeRepository.count({ userId });
      if (count >= 4) throw new ForbiddenException('demo home limit reached');
    }
    const existing = await this.homeRepository.find({ userId });
    const entity: HomeEntity = {
      ...args,
      userId,
      isPrimary: existing.length === 0,
      _id: randomUUID(),
      ...(options?.expiresAt && { expiresAt: options.expiresAt }),
    };
    const record = await this.homeRepository.create(entity);
    return mapToModel(record);
  }

  async setPrimaryHome(id: string, userId: string): Promise<Home> {
    const record = await this.homeRepository.setPrimary(id, userId);
    if (!record) {
      throw new NotFoundError('Home');
    }
    return mapToModel(record);
  }

  async update(id: string, args: UpdateHomeInput): Promise<Home> {
    const record = await this.homeRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new NotFoundError('Home');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.homeRepository.deleteOne(id);
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
