import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { RubeController } from './rube.controller';

@Module({
  imports: [SharedModule],
  controllers: [RubeController],
})
export class RubeModule {}
