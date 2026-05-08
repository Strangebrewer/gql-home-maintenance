import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import {
  CreateHomeTaskArgs,
  GetHomeTasksArgs,
  HomeTask,
  UpdateHomeTaskArgs,
} from './models/home_task.model';
import { HomeTaskService } from './home_task.service';
import { TraceId } from 'src/common/decorators/trace-id.decorator';

@Resolver(() => HomeTask)
export class HomeTaskResolver {
  constructor(private readonly homeTaskService: HomeTaskService) {}

  @Query(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async getHomeTask(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<HomeTask> {
    return this.homeTaskService.findById(id, traceId);
  }

  @Query(() => [HomeTask])
  @UseGuards(JwtAccessGuard)
  async getHomeTasks(
    @TraceId() traceId: string,
    @Args() args: GetHomeTasksArgs,
  ): Promise<HomeTask[]> {
    return this.homeTaskService.find(args.homeId, args.frequency, traceId);
  }

  @Mutation(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async createHomeTask(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateHomeTaskArgs,
  ): Promise<HomeTask> {
    return this.homeTaskService.create(args, userId, traceId);
  }

  @Mutation(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async updateHomeTask(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateHomeTaskArgs,
  ): Promise<HomeTask> {
    return this.homeTaskService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHomeTask(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.homeTaskService.delete(id, traceId);
  }
}
