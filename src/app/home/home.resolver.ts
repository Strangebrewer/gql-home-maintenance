import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateHomeArgs, Home, UpdateHomeArgs } from './models/home.model';
import { HomeService } from './home.service';

@Resolver(() => Home)
export class HomeResolver {
  constructor(private readonly homeService: HomeService) {}

  @Query(() => Home)
  @UseGuards(JwtAccessGuard)
  async getHome(
    @Args('id') id: string,
  ): Promise<Home> {
    return this.homeService.findById(id);
  }

  @Query(() => [Home])
  @UseGuards(JwtAccessGuard)
  async getHomes(
    @JwtUserId() userId: string,
  ): Promise<Home[]> {
    return this.homeService.find(userId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async createHome(
    @JwtUserId() userId: string,
    @Args() args: CreateHomeArgs,
  ): Promise<Home> {
    return this.homeService.create(args, userId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async updateHome(
    @Args('id') id: string,
    @Args() args: UpdateHomeArgs,
  ): Promise<Home> {
    return this.homeService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHome(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.homeService.delete(id);
  }
}
