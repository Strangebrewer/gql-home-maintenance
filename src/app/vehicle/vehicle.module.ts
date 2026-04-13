import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { VehicleCollectionFactory } from '../../common/factory/vehicle.factory';
import { VehicleRepository } from './vehicle.repository';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleService } from './vehicle.service';

@Module({
  imports: [SharedModule],
  providers: [
    VehicleCollectionFactory,
    VehicleRepository,
    VehicleResolver,
    VehicleService,
  ],
})
export class VehicleModule {}
