import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { OidcGuard } from '../../common/guards/oidc.guard';
import { DemoService } from '../demo/demo.service';

type PubSubMessage = {
  message: { data: string; messageId: string; publishTime: string };
  subscription: string;
};

type DemoRegisteredPayload = {
  userId: string;
  expiresAt: string;
};

@Controller('pubsub')
export class PubSubController {
  private readonly logger = new Logger(PubSubController.name);

  constructor(private readonly demoService: DemoService) {}

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

    try {
      await this.demoService.seedDemoData(payload.userId, new Date(payload.expiresAt));
    } catch (err) {
      this.logger.error('failed to seed demo data', { userId: payload.userId, err });
    }
  }
}
