import { Directive, InputType, ObjectType } from '@nestjs/graphql';

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix.

@ObjectType()
@Directive('@key(fields: "id")')
export class Vehicle {
  id: string;
  userId: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  color?: string;
  trim?: string;
  plate?: string;
  vin?: string;
  insuranceId?: string;
}

@InputType()
export class CreateVehicleInput {
  year: number;
  make: string;
  model: string;
  mileage: number;
  color?: string;
  trim?: string;
  plate?: string;
  vin?: string;
  insuranceId?: string;
}

@InputType()
export class UpdateVehicleInput {
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  color?: string;
  trim?: string;
  plate?: string;
  vin?: string;
  insuranceId?: string;
}
