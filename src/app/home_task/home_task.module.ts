import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { HomeTaskCollectionFactory } from '../../common/factory/home_task.factory';
import { HomeTaskRepository } from './home_task.repository';
import { HomeTaskResolver } from './home_task.resolver';
import { HomeTaskService } from './home_task.service';

@Module({
  imports: [SharedModule],
  providers: [
    HomeTaskCollectionFactory,
    HomeTaskRepository,
    HomeTaskResolver,
    HomeTaskService,
  ],
  exports: [HomeTaskRepository],
})
export class HomeTaskModule {}
