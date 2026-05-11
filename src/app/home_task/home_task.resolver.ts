import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import {
  CreateHomeTaskInput,
  GetHomeTasksArgs,
  HomeTask,
  UpdateHomeTaskInput,
} from './models/home_task.model';
import { HomeTaskService } from './home_task.service';

@Resolver(() => HomeTask)
export class HomeTaskResolver {
  constructor(private readonly homeTaskService: HomeTaskService) {}

  @Query(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async getHomeTask(@Args('id') id: string): Promise<HomeTask> {
    return this.homeTaskService.findById(id);
  }

  @Query(() => [HomeTask])
  @UseGuards(JwtAccessGuard)
  async getHomeTasks(@Args() args: GetHomeTasksArgs): Promise<HomeTask[]> {
    return this.homeTaskService.find(args.id, args.frequency);
  }

  @Mutation(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async createHomeTask(
    @JwtUserId() userId: string,
    @Args('input') input: CreateHomeTaskInput,
  ): Promise<HomeTask> {
    return this.homeTaskService.create(input, userId);
  }

  @Mutation(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async updateHomeTask(
    @Args('id') id: string,
    @Args('input') input: UpdateHomeTaskInput,
  ): Promise<HomeTask> {
    return this.homeTaskService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHomeTask(@Args('id') id: string): Promise<DeleteResult> {
    return this.homeTaskService.delete(id);
  }
}
