import { UseGuards } from '@nestjs/common';
import { Args, Field, ArgsType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtAccessGuard, JwtUserId } from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { ServiceRecordType } from './models/service_record.entity';
import { CreateServiceRecordArgs, ServiceRecord, UpdateServiceRecordArgs } from './models/service_record.model';
import { ServiceRecordService } from './service_record.service';

@ArgsType()
class GetServiceRecordsArgs {
  vehicleId: string;
  @Field(() => ServiceRecordType, { nullable: true })
  type?: ServiceRecordType;
}

@Resolver(() => ServiceRecord)
export class ServiceRecordResolver {
  constructor(private readonly serviceRecordService: ServiceRecordService) {}

  @Query(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async getServiceRecord(
    @Args('id') id: string,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.findById(id);
  }

  @Query(() => [ServiceRecord])
  @UseGuards(JwtAccessGuard)
  async getServiceRecords(
    @Args() args: GetServiceRecordsArgs,
  ): Promise<ServiceRecord[]> {
    return this.serviceRecordService.find(args.vehicleId, args.type);
  }

  @Mutation(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async createServiceRecord(
    @JwtUserId() userId: string,
    @Args() args: CreateServiceRecordArgs,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.create(args, userId);
  }

  @Mutation(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async updateServiceRecord(
    @Args('id') id: string,
    @Args() args: UpdateServiceRecordArgs,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.update(id, args);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteServiceRecord(
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.serviceRecordService.delete(id);
  }
}
