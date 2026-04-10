import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { CreateVehicleArgs, DeleteResult, Vehicle, UpdateVehicleArgs } from './vehicle.model';
import { VehicleService } from './vehicle.service';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Query(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async getVehicle(
    @Args('id') id: string,
  ): Promise<Vehicle> {
    return this.vehicleService.findById(id);
  }

  @Query(() => [Vehicle])
  @UseGuards(JwtAccessGuard)
  async getVehicles(
    @JwtUserId() userId: string,
  ): Promise<Vehicle[]> {
    return this.vehicleService.find(userId);
  }

  @Mutation(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async createVehicle(
    @JwtUserId() userId: string,
    @Args() args: CreateVehicleArgs,
  ): Promise<Vehicle> {
    return this.vehicleService.create(args, userId);
  }

  @Mutation(() => Vehicle)
  @UseGuards(JwtAccessGuard)
  async updateVehicle(
    @Args('id') id: string,
    @Args() args: UpdateVehicleArgs,
  ): Promise<Vehicle> {
    return this.vehicleService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteVehicle(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.vehicleService.delete(id);
  }
}
