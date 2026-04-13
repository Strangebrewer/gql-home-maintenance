import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { HomeCollectionFactory } from '../../common/factory/home.factory';
import { HomeRepository } from './home.repository';
import { HomeResolver } from './home.resolver';
import { HomeService } from './home.service';

@Module({
  imports: [SharedModule],
  providers: [
    HomeCollectionFactory,
    HomeRepository,
    HomeResolver,
    HomeService,
  ],
  exports: [HomeRepository],
})
export class HomeModule {}
