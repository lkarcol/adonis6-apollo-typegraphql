import Post from '#models/post'
import { HttpContext } from '@adonisjs/core/http'
import { createMethodDecorator } from 'type-graphql'

type Method = 'edit' | 'delete' | 'create'

export function PostGuard(method: Method) {
  return createMethodDecorator<HttpContext>(async ({ args, context }, next) => {
    const { bouncer, auth, response, session } = context

    await auth.use('web').authenticate()

    const post = await Post.findBy('id', args.data.id)

    switch (method) {
      case 'create':
        break
      case 'edit':
        if (await bouncer.with('PostPolicy').denies(method, post)) {
          throw new Error('Cannot edit the post')
        }
        break
      default:
        break
    }

    return next()
  })
}
