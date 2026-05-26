import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { HomeModule } from '../home/home.module';
import { HomeTaskModule } from '../home_task/home_task.module';
import { HomeCompletionModule } from '../home_completion/home_completion.module';
import { VehicleModule } from '../vehicle/vehicle.module';
import { ServiceRecordModule } from '../service_record/service_record.module';
import { DemoService } from './demo.service';

@Module({
  imports: [SharedModule, HomeModule, HomeTaskModule, HomeCompletionModule, VehicleModule, ServiceRecordModule],
  providers: [DemoService],
  exports: [DemoService],
})
export class DemoModule {}
