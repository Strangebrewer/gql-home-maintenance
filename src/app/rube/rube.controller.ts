import { Controller, Inject, Post, Req, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RubeConfig } from 'src/config/rube';
import { TracerConfig } from 'src/config/tracer';
import { TRACER_CLIENT, TracerClient } from 'src/shared/tracer/tracer.module';

const WORDS = [
  'velocity',
  'trade',
  'biodiversity',
  'refraction',
  'emissions',
  'rainfall',
  'magnetic',
  'energy',
  'watershed',
  'acoustic',
  'agriculture',
  'coral',
  'kinetic',
  'population',
  'permafrost',
  'nuclear',
  'housing',
  'methane',
  'photon',
  'income',
  'nitrogen',
  'spectrum',
  'carbon',
  'diffusion',
  'altitude',
];

@Controller('rube')
export class RubeController {
  constructor(
    @Inject(TRACER_CLIENT) private readonly tracer: TracerClient,
    private readonly configSvc: ConfigService,
  ) {}

  @Post()
  async rubeHandler(@Req() req: Request) {
    console.log(`rube hit`);
    const start = new Date();
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    const traceId = req.headers['x-trace-id'] as string;
    const { service } = this.configSvc.get<TracerConfig>('tracer');
    const { nextUrl } = this.configSvc.get<RubeConfig>('rube');

    const words = [...req.body['words'], word];

    const headers = { 'X-Trace-ID': traceId };

    let downstream;
    try {
      downstream = await axios.post(
        nextUrl,
        { words, userId: req.body['userId'] },
        { headers },
      );
    } catch (error) {
      console.log(
        'error in rubeHandler axios post trycatch:::',
        error['message'],
      );
    }

    if (traceId) {
      try {
        this.tracer.send({
          traceId,
          spanId: crypto.randomUUID(),
          service,
          operation: 'rubeHandler',
          status: 'ok',
          startTime: start,
          endTime: new Date(),
          metaData: { words },
        });
      } catch (error) {
        console.log(
          'error["message"] in rube.controller for tracer send:::',
          error['message'],
        );
      }
    }

    return downstream.data;
  }
}
