import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { HomeTaskFrequency } from './models/home_task.entity';
import { CreateHomeTaskArgs, HomeTask, UpdateHomeTaskArgs } from './models/home_task.model';
import { HomeTaskService } from './home_task.service';

@ArgsType()
class GetHomeTasksArgs {
  homeId: string;
  @Field(() => HomeTaskFrequency, { nullable: true })
  frequency?: HomeTaskFrequency;
}

@Resolver(() => HomeTask)
export class HomeTaskResolver {
  constructor(private readonly homeTaskService: HomeTaskService) {}

  @Query(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async getHomeTask(
    @Args('id') id: string,
  ): Promise<HomeTask> {
    return this.homeTaskService.findById(id);
  }

  @Query(() => [HomeTask])
  @UseGuards(JwtAccessGuard)
  async getHomeTasks(
    @Args() args: GetHomeTasksArgs,
  ): Promise<HomeTask[]> {
    return this.homeTaskService.find(args.homeId, args.frequency);
  }

  @Mutation(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async createHomeTask(
    @JwtUserId() userId: string,
    @Args() args: CreateHomeTaskArgs,
  ): Promise<HomeTask> {
    return this.homeTaskService.create(args, userId);
  }

  @Mutation(() => HomeTask)
  @UseGuards(JwtAccessGuard)
  async updateHomeTask(
    @Args('id') id: string,
    @Args() args: UpdateHomeTaskArgs,
  ): Promise<HomeTask> {
    return this.homeTaskService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHomeTask(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.homeTaskService.delete(id);
  }
}
