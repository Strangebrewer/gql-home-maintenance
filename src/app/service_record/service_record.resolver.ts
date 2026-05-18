import { UseGuards } from '@nestjs/common';
import {
  Args,
  Field,
  ArgsType,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import {
  IsDemo,
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { ServiceRecordType } from './models/service_record.entity';
import {
  CreateServiceRecordInput,
  ServiceRecord,
  UpdateServiceRecordInput,
} from './models/service_record.model';
import { ServiceRecordService } from './service_record.service';

@ArgsType()
class GetServiceRecordsArgs {
  id: string;
  @Field(() => ServiceRecordType, { nullable: true })
  type?: ServiceRecordType;
}

@Resolver(() => ServiceRecord)
export class ServiceRecordResolver {
  constructor(private readonly serviceRecordService: ServiceRecordService) {}

  @Query(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async getServiceRecord(@Args('id') id: string): Promise<ServiceRecord> {
    return this.serviceRecordService.findById(id);
  }

  @Query(() => [ServiceRecord])
  @UseGuards(JwtAccessGuard)
  async getServiceRecords(
    @Args() args: GetServiceRecordsArgs,
  ): Promise<ServiceRecord[]> {
    return this.serviceRecordService.find(args.id, args.type);
  }

  @Mutation(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async createServiceRecord(
    @JwtUserId() userId: string,
    @IsDemo() isDemo: boolean,
    @Args('input') input: CreateServiceRecordInput,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.create(input, userId, { isDemo });
  }

  @Mutation(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async updateServiceRecord(
    @Args('id') id: string,
    @Args('input') input: UpdateServiceRecordInput,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.update(id, input);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteServiceRecord(@Args('id') id: string): Promise<DeleteResult> {
    return this.serviceRecordService.delete(id);
  }
}
