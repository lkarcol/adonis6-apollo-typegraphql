import { ApplicationService } from '@adonisjs/core/types'

import ApolloAdonis from './apollo_adonis.js'
import { HttpContext } from '@adonisjs/core/http'

export default class ApolloProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    //const config = this.app.config.apollo;
    this.app.container.singleton('apollo', () => {
      return new ApolloAdonis(this.app.container)
    })
  }

  async start() {
    const Route = await this.app.container.make('router')
    const apolloAdonis = await this.app.container.make('apollo')

    const apolloServer = await apolloAdonis.createApolloServer()
    await apolloServer.start()

    Route.post('/graphql', (httpContext: HttpContext) =>
      apolloAdonis.makeRouteHandler(apolloServer, httpContext)
    )

    Route.get('/graphql', (httpContext: HttpContext) =>
      apolloAdonis.makeRouteHandler(apolloServer, httpContext)
    )
  }
}

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    apollo: ApolloAdonis
  }
}
