import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { CreateHomeArgs, Home, UpdateHomeArgs } from './models/home.model';
import { HomeService } from './home.service';
import { TraceId } from 'src/common/decorators/trace-id.decorator';

@Resolver(() => Home)
export class HomeResolver {
  constructor(private readonly homeService: HomeService) {}

  @Query(() => Home)
  @UseGuards(JwtAccessGuard)
  async getHome(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<Home> {
    return this.homeService.findById(id, traceId);
  }

  @Query(() => [Home])
  @UseGuards(JwtAccessGuard)
  async getHomes(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
  ): Promise<Home[]> {
    return this.homeService.find(userId, traceId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async createHome(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateHomeArgs,
  ): Promise<Home> {
    return this.homeService.create(args, userId, traceId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async updateHome(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateHomeArgs,
  ): Promise<Home> {
    return this.homeService.update(id, args, traceId);
  }

  @Mutation(() => Home)
  @UseGuards(JwtAccessGuard)
  async setPrimaryHome(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @JwtUserId() userId: string,
  ): Promise<Home> {
    return this.homeService.setPrimaryHome(id, userId, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteHome(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.homeService.delete(id, traceId);
  }
}
