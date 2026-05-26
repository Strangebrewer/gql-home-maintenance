import { Body, Controller, Inject, Logger, Post, UseGuards } from '@nestjs/common';
import { OidcGuard } from '../../common/guards/oidc.guard';
import { DemoService } from '../demo/demo.service';
import { TRACER_CLIENT, TracerClient } from '../../shared/tracer/tracer.module';

type PubSubMessage = {
  message: { data: string; messageId: string; publishTime: string };
  subscription: string;
};

type DemoRegisteredPayload = {
  userId: string;
  expiresAt: string;
  traceId?: string;
};

@Controller('pubsub')
export class PubSubController {
  private readonly logger = new Logger(PubSubController.name);

  constructor(
    private readonly demoService: DemoService,
    @Inject(TRACER_CLIENT) private readonly tracer: TracerClient,
  ) {}

  @Post('demo-registered')
  @UseGuards(OidcGuard)
  async handleDemoRegistered(@Body() body: PubSubMessage): Promise<void> {
    let payload: DemoRegisteredPayload;
    try {
      payload = JSON.parse(Buffer.from(body.message.data, 'base64').toString('utf8'));
    } catch (err) {
      this.logger.error('failed to decode demo-registered payload', err);
      return;
    }

    const start = new Date();
    try {
      await this.demoService.seedDemoData(payload.userId, new Date(payload.expiresAt));
      this.tracer.sendSpan(payload.traceId, 'demo seed', start, new Date());
    } catch (err) {
      this.logger.error('failed to seed demo data', { userId: payload.userId, err });
      this.tracer.sendErrorSpan(payload.traceId, 'demo seed', String(err), start, new Date());
    }
  }
}
