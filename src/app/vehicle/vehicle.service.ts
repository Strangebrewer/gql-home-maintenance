import { randomUUID } from 'crypto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { VehicleEntity } from './models/vehicle.entity';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  Vehicle,
} from './models/vehicle.model';
import { VehicleRepository } from './vehicle.repository';
import { NotFoundError } from '../../common/errors';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async findById(id: string): Promise<Vehicle> {
    const record = await this.vehicleRepository.findById(id);
    if (!record) {
      throw new NotFoundError('Vehicle');
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Vehicle[]> {
    const records = await this.vehicleRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateVehicleInput, userId: string, options?: { isDemo?: boolean; expiresAt?: Date }): Promise<Vehicle> {
    if (options?.isDemo) {
      const count = await this.vehicleRepository.count({ userId });
      if (count >= 3) throw new ForbiddenException('demo vehicle limit reached');
    }
    const entity: VehicleEntity = {
      ...args,
      userId,
      _id: randomUUID(),
      ...(options?.expiresAt && { expiresAt: options.expiresAt }),
    };
    const record = await this.vehicleRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateVehicleInput): Promise<Vehicle> {
    const record = await this.vehicleRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new NotFoundError('Vehicle');
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    const result = await this.vehicleRepository.deleteOne(id);
    return result;
  }
}

function mapToModel(entity: VehicleEntity): Vehicle {
  return {
    id: entity._id,
    userId: entity.userId,
    year: entity.year,
    make: entity.make,
    model: entity.model,
    mileage: entity.mileage,
    color: entity.color,
    trim: entity.trim,
    plate: entity.plate,
    vin: entity.vin,
    insuranceId: entity.insuranceId,
  };
}
