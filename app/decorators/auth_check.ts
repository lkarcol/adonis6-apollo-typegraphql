import { HttpContext } from '@adonisjs/core/http'
import { AuthChecker } from 'type-graphql'

export const AuthCheck: AuthChecker<HttpContext> = async ({ root, args, context, info }, roles) => {
  const { session, auth } = context
  await auth.use('web').authenticate()
  const user = auth.use('web').user

  return user !== undefined
}
