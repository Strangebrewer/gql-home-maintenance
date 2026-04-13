import { ArgsType, Directive, ObjectType } from '@nestjs/graphql';

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix.

@ObjectType()
@Directive('@key(fields: "id")')
export class Home {
  id: string;
  userId: string;
  address: string;
  yearBuilt?: number;
  sqFootage?: number;
  notes?: string;
}

@ArgsType()
export class CreateHomeArgs {
  address: string;
  yearBuilt?: number;
  sqFootage?: number;
  notes?: string;
}

@ArgsType()
export class UpdateHomeArgs {
  address?: string;
  yearBuilt?: number;
  sqFootage?: number;
  notes?: string;
}
