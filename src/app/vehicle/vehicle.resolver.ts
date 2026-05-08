import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import {
  CreateVehicleArgs,
  Vehicle,
  UpdateVehicleArgs,
} from './models/vehicle.model';
import { VehicleService } from './vehicle.service';
import { TraceId } from 'src/common/decorators/trace-id.decorator';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Query(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async getVehicle(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<Vehicle> {
    return this.vehicleService.findById(id, traceId);
  }

  @Query(() => [Vehicle])
  @UseGuards(JwtAccessGuard)
  async getVehicles(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
  ): Promise<Vehicle[]> {
    return this.vehicleService.find(userId, traceId);
  }

  @Mutation(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async createVehicle(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateVehicleArgs,
  ): Promise<Vehicle> {
    return this.vehicleService.create(args, userId, traceId);
  }

  @Mutation(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async updateVehicle(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateVehicleArgs,
  ): Promise<Vehicle> {
    return this.vehicleService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteVehicle(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.vehicleService.delete(id, traceId);
  }
}
