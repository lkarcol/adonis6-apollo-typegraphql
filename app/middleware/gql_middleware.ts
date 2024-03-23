import { HttpContext } from '@adonisjs/core/http'
import { MiddlewareFn } from 'type-graphql'
import InitializeBouncerMiddleware from './initialize_bouncer_middleware.js'
import { Bouncer } from '@adonisjs/bouncer'
import { policies } from '#policies/main'
// Adonis Session is inactive in Apollo Server Request
// This middlaware is registerd as global in buildSchema function

export const GqlSessionActivator: MiddlewareFn<HttpContext> = async ({ context }, next) => {
  const { auth, session } = context
  await session.initiate(false)

  return next()
}
