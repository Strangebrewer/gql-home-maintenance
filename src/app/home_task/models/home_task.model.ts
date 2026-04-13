import { ArgsType, Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { HomeTaskFrequency } from './home_task.entity';

// @Field() decorators are not required on these types — the @nestjs/graphql
// CLI plugin (configured in nest-cli.json) infers them automatically from
// files matching the .model.ts suffix. Enum fields require explicit @Field()
// decorators so the plugin knows which GraphQL enum type to use.

registerEnumType(HomeTaskFrequency, { name: 'HomeTaskFrequency' });

@ObjectType()
export class HomeTask {
  id: string;
  userId: string;
  homeId: string;
  name: string;
  @Field(() => HomeTaskFrequency)
  frequency: HomeTaskFrequency;
  description?: string;
}

@ArgsType()
export class CreateHomeTaskArgs {
  homeId: string;
  name: string;
  @Field(() => HomeTaskFrequency)
  frequency: HomeTaskFrequency;
  description?: string;
}

@ArgsType()
export class UpdateHomeTaskArgs {
  name?: string;
  @Field(() => HomeTaskFrequency, { nullable: true })
  frequency?: HomeTaskFrequency;
  description?: string;
}
