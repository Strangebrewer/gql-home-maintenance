import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { SharedModule } from './shared/shared.module';
import { HomeCompletionModule } from './app/home_completion/home_completion.module';
import { HomeModule } from './app/home/home.module';
import { HomeTaskModule } from './app/home_task/home_task.module';
import { ServiceRecordModule } from './app/service_record/service_record.module';
import { VehicleModule } from './app/vehicle/vehicle.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.local',
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty' }
          : undefined,
      },
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { federation: 2 },
    }),
    SharedModule,
    VehicleModule,
    ServiceRecordModule,
    HomeModule,
    HomeTaskModule,
    HomeCompletionModule,
  ],
})
export class AppModule {}
