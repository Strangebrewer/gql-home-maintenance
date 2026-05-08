import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import {
  CreateHomeCompletionArgs,
  HomeCompletion,
  UpdateHomeCompletionArgs,
} from './models/home_completion.model';
import { HomeCompletionService } from './home_completion.service';
import { TraceId } from 'src/common/decorators/trace-id.decorator';

@Resolver(() => HomeCompletion)
export class HomeCompletionResolver {
  constructor(private readonly homeCompletionService: HomeCompletionService) {}

  @Query(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async getHomeCompletion(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.findById(id, traceId);
  }

  @Query(() => [HomeCompletion])
  @UseGuards(JwtAccessGuard)
  async getHomeCompletionsByTask(
    @TraceId() traceId: string,
    @Args('taskId') taskId: string,
  ): Promise<HomeCompletion[]> {
    return this.homeCompletionService.findByTask(taskId, traceId);
  }

  @Query(() => [HomeCompletion])
  @UseGuards(JwtAccessGuard)
  async getHomeCompletionsByHome(
    @TraceId() traceId: string,
    @Args('homeId') homeId: string,
  ): Promise<HomeCompletion[]> {
    return this.homeCompletionService.findByHome(homeId, traceId);
  }

  @Mutation(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async createHomeCompletion(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateHomeCompletionArgs,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.create(args, userId, traceId);
  }

  @Mutation(() => HomeCompletion)
  @UseGuards(JwtAccessGuard)
  async updateHomeCompletion(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateHomeCompletionArgs,
  ): Promise<HomeCompletion> {
    return this.homeCompletionService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHomeCompletion(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.homeCompletionService.delete(id, traceId);
  }
}
