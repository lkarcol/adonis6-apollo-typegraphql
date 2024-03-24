import * as fs from 'node:fs'

import * as path from 'node:path'
import { NonEmptyArray, buildSchema } from 'type-graphql'

import { fileURLToPath } from 'node:url'
import { ApplicationService } from '@adonisjs/core/types'
import { apollo } from '#config/graphql'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// TypeGraphql is suporting some IOC containnres (TypeDi,InversifyJS,...)
// Because we lost adonis dependency injections inside Resolvers when we create route
//    Route.post('/graphql', (httpContext: HttpContext) =>
//      apolloAdonis.makeRouteHandler(apolloServer, httpContext)
//    )
// This is hack how TypeGraphql can use adonis IOC container, wen can use inject() for resolvers and services,...
class HackIOC {
  constructor(private app: ApplicationService['container']) {}
  async get(someClass, data) {
    return await this.app.make(someClass, data)
  }
}

class Schema {
  static async make(app: ApplicationService) {
    const config = apollo
    const resolversPath: string = path.join(__dirname, '../../app')

    const resolversModules = await this.loadResolvers(resolversPath)

    if (resolversModules.length === 0) {
      throw new Error('No valid resolvers found.')
    }

    const schema = await buildSchema({
      resolvers: resolversModules as NonEmptyArray<Function>,
      ...config.typeGraphql,
      container: new HackIOC(app.container),
      validateFn: async (argValue, argType) => {
        if (argType.validator) {
          const inputTypeInstance = await argType.validator.validate(argValue)
          console.log(inputTypeInstance)
        }
      },
    })

    return {
      schema,
    }
  }

  private static async loadResolvers(folderPath: string) {
    const resolvers: Function[] = []

    const files = await fs.promises.readdir(folderPath)

    for (const file of files) {
      const filePath = path.join(folderPath, file)

      // eslint-disable-next-line unicorn/no-await-expression-member
      const isDirectory = (await fs.promises.stat(filePath)).isDirectory()

      if (isDirectory) {
        resolvers.push(...(await this.loadResolvers(filePath)))
      } else if (file.endsWith('.js') || file.endsWith('.ts')) {
        const resolverModule = await import(filePath)

        if (resolverModule.default) {
          resolvers.push(resolverModule.default)
        }
      }
    }

    return resolvers
  }
}

export default Schema
