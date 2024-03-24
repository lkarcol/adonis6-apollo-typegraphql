import { ApolloServer } from '@apollo/server'
import Schema from './schema.js'
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { httpRequestHandler } from './http_request_handler.js'
import { HttpContext } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'

export default class ApolloAdonis {
  constructor(private app: ApplicationService) {}

  async createApolloServer() {
    const schema = await Schema.make(this.app)

    return new ApolloServer({
      ...schema,
      csrfPrevention: false,
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageProductionDefault()
          : ApolloServerPluginLandingPageLocalDefault(),
      ],
    })
  }

  async makeRouteHandler(apolloServer: ApolloServer, httpContext: HttpContext) {
    return httpRequestHandler(apolloServer, (ctx) => ctx, httpContext)
  }
}
