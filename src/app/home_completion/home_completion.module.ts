import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { HomeTaskModule } from '../home_task/home_task.module';
import { HomeCompletionCollectionFactory } from '../../common/factory/home_completion.factory';
import { HomeCompletionRepository } from './home_completion.repository';
import { HomeCompletionResolver } from './home_completion.resolver';
import { HomeCompletionService } from './home_completion.service';

@Module({
  imports: [SharedModule, HomeTaskModule],
  providers: [
    HomeCompletionCollectionFactory,
    HomeCompletionRepository,
    HomeCompletionResolver,
    HomeCompletionService,
  ],
})
export class HomeCompletionModule {}
