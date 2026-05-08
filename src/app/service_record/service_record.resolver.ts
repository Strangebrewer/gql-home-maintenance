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
  JwtAccessGuard,
  JwtUserId,
} from '../../common/guards/jwt-access.guard';
import { DeleteResult } from '../../common/models/common.model';
import { ServiceRecordType } from './models/service_record.entity';
import {
  CreateServiceRecordArgs,
  ServiceRecord,
  UpdateServiceRecordArgs,
} from './models/service_record.model';
import { ServiceRecordService } from './service_record.service';
import { TraceId } from 'src/common/decorators/trace-id.decorator';

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
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.findById(id, traceId);
  }

  @Query(() => [ServiceRecord])
  @UseGuards(JwtAccessGuard)
  async getServiceRecords(
    @TraceId() traceId: string,
    @Args() args: GetServiceRecordsArgs,
  ): Promise<ServiceRecord[]> {
    return this.serviceRecordService.find(args.vehicleId, args.type, traceId);
  }

  @Mutation(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async createServiceRecord(
    @TraceId() traceId: string,
    @JwtUserId() userId: string,
    @Args() args: CreateServiceRecordArgs,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.create(args, userId, traceId);
  }

  @Mutation(() => ServiceRecord)
  @UseGuards(JwtAccessGuard)
  async updateServiceRecord(
    @TraceId() traceId: string,
    @Args('id') id: string,
    @Args() args: UpdateServiceRecordArgs,
  ): Promise<ServiceRecord> {
    return this.serviceRecordService.update(id, args, traceId);
  }

  @Mutation(() => DeleteResult)
  @UseGuards(JwtAccessGuard)
  async deleteServiceRecord(
    @TraceId() traceId: string,
    @Args('id') id: string,
  ): Promise<DeleteResult> {
    return this.serviceRecordService.delete(id, traceId);
  }
}
