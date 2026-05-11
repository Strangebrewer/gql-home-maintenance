import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import {
  CreateHomeCompletionInput,
  HomeCompletion,
  UpdateHomeCompletionInput,
} from './models/home_completion.model';
import { HomeCompletionService } from './home_completion.service';

@Resolver(() => HomeCompletion)
export class HomeCompletionResolver {
  constructor(private readonly homeCompletionService: HomeCompletionService) {}

  @Query(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async getHomeCompletion(@Args('id') id: string): Promise<HomeCompletion> {
    return this.homeCompletionService.findById(id);
  }

  @Query(() => [HomeCompletion])
  @UseGuards(JwtAccessGuard)
  async getHomeCompletionsByTask(
    @Args('id') id: string,
  ): Promise<HomeCompletion[]> {
    return this.homeCompletionService.findByTask(id);
  }

  @Query(() => [HomeCompletion])
  @UseGuards(JwtAccessGuard)
  async getHomeCompletionsByHome(
    @Args('id') id: string,
  ): Promise<HomeCompletion[]> {
    return this.homeCompletionService.findByHome(id);
  }

  @Mutation(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async createHomeCompletion(
    @JwtUserId() userId: string,
    @Args('input') input: CreateHomeCompletionInput,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.create(input, userId);
  }

  @Mutation(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async updateHomeCompletion(
    @Args('id') id: string,
    @Args('input') input: UpdateHomeCompletionInput,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHomeCompletion(@Args('id') id: string): Promise<DeleteResult> {
    return this.homeCompletionService.delete(id);
  }
}
