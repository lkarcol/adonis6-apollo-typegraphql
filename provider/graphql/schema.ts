import * as fs from 'node:fs'

import * as path from 'node:path'
import { NonEmptyArray, buildSchema } from 'type-graphql'

import { fileURLToPath } from 'node:url'
import { ApplicationService } from '@adonisjs/core/types'
import { AuthCheck } from '../../app/decorators/auth_check.js'
import { GqlSessionActivator } from '#middleware/gql_middleware'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class HackIOC {
  constructor(private app: ApplicationService['container']) {}

  async get(someClass, data) {
    return await this.app.make(someClass, data)
  }
}

class Schema {
  static async make(config: any, app: ApplicationService['container']) {
    const resolversPath: string = config.resolvers ?? path.join(__dirname, '../../app')

    const resolversModules = await this.loadResolvers(resolversPath)

    if (resolversModules.length === 0) {
      throw new Error('No valid resolvers found.')
    }

    const schema = await buildSchema({
      resolvers: resolversModules as NonEmptyArray<Function>,
      ...config.typeGraphql,
      container: new HackIOC(app),
      authChecker: AuthCheck,
      authMode: null,
      // globalMiddlewares: [GqlSessionActivator],
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
