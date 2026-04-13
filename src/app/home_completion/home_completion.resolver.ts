import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateHomeCompletionArgs, HomeCompletion, UpdateHomeCompletionArgs } from './models/home_completion.model';
import { HomeCompletionService } from './home_completion.service';

@Resolver(() => HomeCompletion)
export class HomeCompletionResolver {
  constructor(private readonly homeCompletionService: HomeCompletionService) {}

  @Query(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async getHomeCompletion(
    @Args('id') id: string,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.findById(id);
  }

  @Query(() => [HomeCompletion])
  @UseGuards(JwtAccessGuard)
  async getHomeCompletionsByTask(
    @Args('taskId') taskId: string,
  ): Promise<HomeCompletion[]> {
    return this.homeCompletionService.findByTask(taskId);
  }

  @Query(() => [HomeCompletion])
  @UseGuards(JwtAccessGuard)
  async getHomeCompletionsByHome(
    @Args('homeId') homeId: string,
  ): Promise<HomeCompletion[]> {
    return this.homeCompletionService.findByHome(homeId);
  }

  @Mutation(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async createHomeCompletion(
    @JwtUserId() userId: string,
    @Args() args: CreateHomeCompletionArgs,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.create(args, userId);
  }

  @Mutation(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async updateHomeCompletion(
    @Args('id') id: string,
    @Args() args: UpdateHomeCompletionArgs,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHomeCompletion(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.homeCompletionService.delete(id);
  }
}
