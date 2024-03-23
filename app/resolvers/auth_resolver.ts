import { HttpContext } from '@adonisjs/core/http'
import { GraphQLJSON } from 'graphql-scalars'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CreateUserInput } from '../inputs/user_input.js'
import User from '#models/user'
import { inject } from '@adonisjs/core'

@Resolver()
@inject()
export default class AuthResolver {
  constructor() {}

  @Query((returns) => String)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { response, auth }: HttpContext
  ) {
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)
    return 'ok'
  }

  @Mutation((returns) => String)
  async signup(@Arg('data') data: CreateUserInput, @Ctx() { response, auth }: HttpContext) {
    const existUser = await User.findBy('email', data.email)

    if (existUser) {
      throw new Error('Email already exist')
    }

    const user = await User.create({
      email: data.email,
      password: data.password,
    })

    await auth.use('web').login(user)
    return 'ok'
  }
}
