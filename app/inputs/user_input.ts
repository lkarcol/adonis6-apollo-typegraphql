import User from '#models/user'
import { Field, InputType, registerEnumType } from 'type-graphql'

@InputType({ description: 'New user data' })
export class CreateUserInput implements Partial<User> {
  @Field()
  declare email: string

  @Field()
  declare password: string
}
