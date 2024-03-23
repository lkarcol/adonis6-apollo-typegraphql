import Post from '#models/post'
import { Field, InputType } from 'type-graphql'

@InputType({ description: 'New post data' })
export class CreatePostInput implements Partial<Post> {
  @Field()
  declare title: string
}

@InputType({ description: 'New post data' })
export class UpdatePostInput implements Partial<Post> {
  @Field()
  declare id: number

  @Field()
  declare title: string
}
