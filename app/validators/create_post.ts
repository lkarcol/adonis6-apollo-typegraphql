import vine from '@vinejs/vine'
import { Infer } from '@vinejs/vine/types'

export const createPostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
  })
)

export const updatePostValidator = vine.compile(
  vine.object({
    title: vine.string().trim().minLength(6),
  })
)

export type CreatePostInputValidator = Infer<typeof createPostValidator>
export type UpdatePostInputValidator = Infer<typeof updatePostValidator>
