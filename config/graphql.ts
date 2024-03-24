import { HttpContext } from '@adonisjs/core/http'
import { AuthCheck } from '../app/decorators/auth_check.js'

export const apollo = {
  context: (ctx: HttpContext) => {
    ctx.dataloader = null
    return ctx
  },
  typeGraphql: {
    authChecker: AuthCheck,
  },
}
