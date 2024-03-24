import {
  CreatePostInputValidator,
  UpdatePostInputValidator,
  createPostValidator,
  updatePostValidator,
} from '#validators/create_post'
import { Field, InputType } from 'type-graphql'

@InputType({ description: 'New post data' })
export class CreatePostInput implements CreatePostInputValidator {
  static validator = createPostValidator

  @Field()
  declare title: string
}

@InputType({ description: 'New post data' })
export class UpdatePostInput implements UpdatePostInputValidator {
  static validator = updatePostValidator

  @Field()
  declare id: number

  @Field()
  declare title: string
}
