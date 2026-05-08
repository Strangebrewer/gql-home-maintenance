import { randomUUID } from 'crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteResult } from '../../common/models/common.model';
import { VehicleEntity } from './models/vehicle.entity';
import {
  CreateVehicleArgs,
  UpdateVehicleArgs,
  Vehicle,
} from './models/vehicle.model';
import { VehicleRepository } from './vehicle.repository';
import { NotFoundError } from '../../common/errors';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';

@Injectable()
export class VehicleService {
  constructor(
    private readonly vehicleRepository: VehicleRepository,
    @Inject(TRACER_CLIENT) private tracer: TracerClient,
  ) {}

  async findById(id: string, traceId?: string): Promise<Vehicle> {
    const start = new Date();
    const op = `find_vehicle by id: ${id}`;
    const record = await this.vehicleRepository.findById(id);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Vehicle not found', start, end);
      throw new NotFoundError('Vehicle');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async find(userId: string, traceId?: string): Promise<Vehicle[]> {
    const start = new Date();
    const op = 'find_vehicles';
    const records = await this.vehicleRepository.find({ userId });
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return records.map(mapToModel);
  }

  async create(
    args: CreateVehicleArgs,
    userId: string,
    traceId?: string,
  ): Promise<Vehicle> {
    const start = new Date();
    const op = 'create_vehicle';
    const entity: VehicleEntity = {
      ...args,
      userId,
      _id: randomUUID(),
    };
    const record = await this.vehicleRepository.create(entity);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async update(
    id: string,
    args: UpdateVehicleArgs,
    traceId?: string,
  ): Promise<Vehicle> {
    const start = new Date();
    const op = `update_vehicle by id: ${id}`;
    const record = await this.vehicleRepository.findOneAndUpdate(id, args);
    if (!record) {
      const end = new Date();
      this.tracer.sendErrorSpan(traceId, op, 'Vehicle not found', start, end);
      throw new NotFoundError('Vehicle');
    }
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
    return mapToModel(record);
  }

  async delete(id: string, traceId?: string): Promise<DeleteResult> {
    const start = new Date();
    const op = `delete_vehicle by id: ${id}`;
    const result = await this.vehicleRepository.deleteOne(id);
    const end = new Date();
    this.tracer.sendSpan(traceId, op, start, end);
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
