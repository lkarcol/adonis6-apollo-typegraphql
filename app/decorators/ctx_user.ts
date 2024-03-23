import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { createParamDecorator } from 'type-graphql'

export default function CurrentUser() {
  return createParamDecorator<HttpContext>(async ({ args, context }): Promise<User> => {
    const { auth } = context
    await auth.use('web').authenticate()
    const user = auth.use('web').user!

    return user
  })
}
