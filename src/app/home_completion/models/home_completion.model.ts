import { ArgsType, ObjectType } from '@nestjs/graphql';

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix.

@ObjectType()
export class HomeCompletion {
  id: string;
  userId: string;
  homeId: string;
  taskId: string;
  date: string;
  cost?: number;
  notes?: string;
}

@ArgsType()
export class CreateHomeCompletionArgs {
  taskId: string;
  date: string;
  cost?: number;
  notes?: string;
}

@ArgsType()
export class UpdateHomeCompletionArgs {
  date?: string;
  cost?: number;
  notes?: string;
}
