import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateHomeInput, Home, UpdateHomeInput } from './models/home.model';
import { HomeService } from './home.service';

@Resolver(() => Home)
export class HomeResolver {
  constructor(private readonly homeService: HomeService) {}

  @Query(() => Home)
  @UseGuards(JwtAccessGuard)
  async getHome(@Args('id') id: string): Promise<Home> {
    return this.homeService.findById(id);
  }

  @Query(() => [Home])
  @UseGuards(JwtAccessGuard)
  async getHomes(@JwtUserId() userId: string): Promise<Home[]> {
    return this.homeService.find(userId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async createHome(
    @JwtUserId() userId: string,
    @Args('input') input: CreateHomeInput,
  ): Promise<Home> {
    return this.homeService.create(input, userId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async updateHome(
    @Args('id') id: string,
    @Args('input') input: UpdateHomeInput,
  ): Promise<Home> {
    return this.homeService.update(id, input);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async setPrimaryHome(
    @Args('id') id: string,
    @JwtUserId() userId: string,
  ): Promise<Home> {
    return this.homeService.setPrimaryHome(id, userId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHome(@Args('id') id: string): Promise<DeleteResult> {
    return this.homeService.delete(id);
  }
}
