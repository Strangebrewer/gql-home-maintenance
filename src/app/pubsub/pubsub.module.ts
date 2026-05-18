import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { DemoModule } from '../demo/demo.module';
import { PubSubController } from './pubsub.controller';

@Module({
  imports: [SharedModule, DemoModule],
  controllers: [PubSubController],
})
export class PubSubModule {}
