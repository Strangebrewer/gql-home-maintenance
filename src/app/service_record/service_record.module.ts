import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { ServiceRecordCollectionFactory } from '../../common/factory/service_record.factory';
import { ServiceRecordRepository } from './service_record.repository';
import { ServiceRecordResolver } from './service_record.resolver';
import { ServiceRecordService } from './service_record.service';

@Module({
  imports: [SharedModule],
  providers: [
    ServiceRecordCollectionFactory,
    ServiceRecordRepository,
    ServiceRecordResolver,
    ServiceRecordService,
  ],
})
export class ServiceRecordModule {}
