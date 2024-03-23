import User from '#models/user'
import { inject } from '@adonisjs/core'
import { Arg, Authorized, Query, Resolver } from 'type-graphql'
import CurrentUser from '../decorators/ctx_user.js'

@inject()
class UserService {
  async getAll() {
    return await User.all()
  }

  async getByEmail(email: String) {
    return await User.findBy('email', email)
  }
}

@Resolver()
@inject()
export default class UserResolver {
  constructor(protected userService: UserService) {}

  @Query(() => [User])
  async users() {
    const users = await this.userService.getAll()
    return users
  }

  @Authorized()
  @Query(() => User)
  async me(@CurrentUser() user: User) {
    return user
  }

  @Query(() => User)
  async user(@Arg('email') email: String) {
    return await this.userService.getByEmail(email)
  }
}
