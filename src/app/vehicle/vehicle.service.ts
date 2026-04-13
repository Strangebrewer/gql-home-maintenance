import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { IdGeneratorService } from '../../shared/libs/id-generator/id-generator.service';
import { DeleteResult } from '../../common/models/common.model';
import { VehicleEntity } from './models/vehicle.entity';
import { CreateVehicleArgs, UpdateVehicleArgs, Vehicle } from './models/vehicle.model';
import { VehicleRepository } from './vehicle.repository';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    private readonly idGenerator: IdGeneratorService,
  ) {}

  async findById(id: string): Promise<Vehicle> {
    const record = await this.vehicleRepository.findById(id);
    if (!record) {
      throw new GraphQLError('Vehicle not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async find(userId: string): Promise<Vehicle[]> {
    const records = await this.vehicleRepository.find({ userId });
    return records.map(mapToModel);
  }

  async create(args: CreateVehicleArgs, userId: string): Promise<Vehicle> {
    const entity: VehicleEntity = {
      ...args,
      userId,
      id: this.idGenerator.generate('VHL'),
    };
    const record = await this.vehicleRepository.create(entity);
    return mapToModel(record);
  }

  async update(id: string, args: UpdateVehicleArgs): Promise<Vehicle> {
    const record = await this.vehicleRepository.findOneAndUpdate(id, args);
    if (!record) {
      throw new GraphQLError('Vehicle not found', {
        extensions: { code: 404 },
      });
    }
    return mapToModel(record);
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.vehicleRepository.deleteOne(id);
  }
}

function mapToModel(entity: VehicleEntity): Vehicle {
  return {
    id: entity.id,
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
