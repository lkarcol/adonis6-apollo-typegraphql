import { DateTime } from 'luxon'
import { column, BaseModel, hasOne } from '@adonisjs/lucid/orm'
import User from './user.js'
import { type HasOne } from '@adonisjs/lucid/types/relations'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export default class Post extends BaseModel {
  @Field()
  @column({ isPrimary: true })
  declare id: number

  @Field()
  @column()
  declare title: string

  @column()
  declare userId: number

  @Field(() => User)
  @hasOne(() => User)
  declare author: HasOne<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
