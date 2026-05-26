import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ServiceRecordType } from './service_record.entity';

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix. Enum fields require explicit @Field()
// decorators so the plugin knows which GraphQL enum type to use.

registerEnumType(ServiceRecordType, { name: 'ServiceRecordType' });

@ObjectType()
export class ServiceRecord {
  id: string;
  userId: string;
  vehicleId: string;
  @Field(() => ServiceRecordType)
  type: ServiceRecordType;
  date: string;
  mileage: number;
  cost?: number;
  name?: string;
  description?: string;
}

@InputType()
export class CreateServiceRecordInput {
  vehicleId: string;
  @Field(() => ServiceRecordType)
  type: ServiceRecordType;
  date: string;
  mileage: number;
  cost?: number;
  name?: string;
  description?: string;
}

@InputType()
export class UpdateServiceRecordInput {
  date?: string;
  mileage?: number;
  cost?: number;
  name?: string;
  description?: string;
}
