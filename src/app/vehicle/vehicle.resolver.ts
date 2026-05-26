import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  IsDemo,
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import {
  CreateVehicleInput,
  Vehicle,
  UpdateVehicleInput,
} from './models/vehicle.model';
import { VehicleService } from './vehicle.service';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Query(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async getVehicle(@Args('id') id: string): Promise<Vehicle> {
    return this.vehicleService.findById(id);
  }

  @Query(() => [Vehicle])
  @UseGuards(JwtAccessGuard)
  async getVehicles(@JwtUserId() userId: string): Promise<Vehicle[]> {
    return this.vehicleService.find(userId);
  }

  @Mutation(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async createVehicle(
    @JwtUserId() userId: string,
    @IsDemo() isDemo: boolean,
    @Args('input') input: CreateVehicleInput,
  ): Promise<Vehicle> {
    return this.vehicleService.create(input, userId, { isDemo });
  }

  @Mutation(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async updateVehicle(
    @Args('id') id: string,
    @Args('input') input: UpdateVehicleInput,
  ): Promise<Vehicle> {
    return this.vehicleService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteVehicle(@Args('id') id: string): Promise<DeleteResult> {
    return this.vehicleService.delete(id);
  }
}
