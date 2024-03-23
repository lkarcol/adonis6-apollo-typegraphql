import Post from '#models/post'
import { inject } from '@adonisjs/core'
import { Arg, Authorized, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import { CreatePostInput, UpdatePostInput } from '../inputs/post_input.js'
import CurrentUser from '../decorators/ctx_user.js'
import User from '#models/user'
import { PostGuard } from '../decorators/post_guard.js'
import { HttpContext } from '@adonisjs/core/http'

class PostService {
  async getAll() {
    return Post.all()
  }

  async createPost(user: User, post: CreatePostInput) {
    return await Post.create({
      ...post,
      userId: user.id,
    })
  }

  async editPost(post: UpdatePostInput) {
    return await Post.query()
      .update({
        ...post,
      })
      .where('id', post.id)
  }
}

@Resolver(() => Post)
@inject()
export default class PostResolver {
  constructor(protected postService: PostService) {}

  @Query(() => [Post])
  async posts() {
    return await this.postService.getAll()
  }

  @Authorized()
  @Mutation(() => String)
  async createPost(@CurrentUser() user: User, @Arg('data') post: CreatePostInput) {
    await this.postService.createPost(user, post)
    return 'ok'
  }

  @Authorized()
  @PostGuard('edit')
  @Mutation(() => String)
  async editPost(@Arg('data') editedPost: UpdatePostInput) {
    await this.postService.editPost(editedPost)
    return 'ok'
  }

  @FieldResolver()
  async author(@Root() post: Post) {
    return await User.findBy('id', post.userId)
  }
}
