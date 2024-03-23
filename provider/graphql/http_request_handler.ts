import { HttpContext } from '@adonisjs/core/http'
import { ApolloServer, HeaderMap, ContextFunction, type BaseContext } from '@apollo/server'
import type { IncomingHttpHeaders } from 'node:http'
import { Readable } from 'node:stream'

export async function httpRequestHandler(
  apolloServer: ApolloServer<BaseContext>,
  contextFunction: ContextFunction<any>,
  ctx: HttpContext
): Promise<void> {
  const { body, headers, status } = await apolloServer.executeHTTPGraphQLRequest({
    httpGraphQLRequest: {
      method: ctx.request.method(),
      headers: transformHeaders(ctx.request.headers()),
      body: ctx.request.body(),
      search: ctx.request.parsedUrl.search ?? '',
    },
    context() {
      return contextFunction(ctx)
    },
  })

  for (const [name, value] of headers) {
    ctx.response.header(name, value)
  }

  ctx.response.status(status ?? 200)

  if (body.kind === 'complete') {
    return ctx.response.send(body.string)
  } else {
    return ctx.response.stream(Readable.from(body.asyncIterator))
  }
}

function transformHeaders(headers: IncomingHttpHeaders): HeaderMap {
  const map = new HeaderMap()

  for (const [name, value] of Object.entries(headers)) {
    if (value) {
      map.set(name, Array.isArray(value) ? value.join(', ') : value)
    }
  }

  return map
}
