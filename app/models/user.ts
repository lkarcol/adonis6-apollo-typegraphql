import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { Field, ObjectType } from 'type-graphql'
import Post from './post.js'
import { type HasMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

@ObjectType()
export default class User extends compose(BaseModel, AuthFinder) {
  @Field()
  @column({ isPrimary: true })
  declare id: number

  @Field(() => String, { nullable: true })
  @column()
  declare fullName: string | null

  @Field()
  @column()
  declare email: string

  @Field(() => [Post])
  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
