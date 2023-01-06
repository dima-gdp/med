import striptags from 'striptags'

import { DataSource } from '../../../data-source'
import {Db, DbMessage, ISection} from '../../../data-source/Db'
import {Redis, ExtendedMessage} from '../../../data-source/Redis'
import { formatDateWithoutLocal } from '../../../core/utils'
import {Section} from '../domain/Section'

export class Message {
  private readonly user: any
  private data: any
  private body: string
  private readonly db: Db
  private readonly redis: Redis

  constructor(user: any, data: any, dataSource: DataSource) {
    const { message } = data

    this.db = dataSource.db
    this.redis = dataSource.redis
    this.user = user
    this.data = data
    this.body = striptags(message, '<b>')
  }

  public async save(type: string): Promise<ExtendedMessage> {
    const { viewpoint } = this.user

    this.body = Message._decode(this.body)

    const section = await Section.getCurrentSection(this.db, this.redis, this.data.room)

    const [message] = await this.db.createMessage(
      this.user.user_id,
      this.body,
      this.data.parent || null,
      type,
      viewpoint ? viewpoint.id : null,
      this.data.room,
      section!.id,
    )

    const savedMessage = this.extendMessage(message)

    await this.redis.createMessage(savedMessage.room, savedMessage)

    return savedMessage
  }

  extendMessage (message: DbMessage): ExtendedMessage {
    return {
      ...message,
      username: this.user.username,
      role :this.user.role,
      administrator: this.user.administrator,
      parent: !!this.data.parent,
      city: this.user.city,
      region: this.user.region,
      country_name: this.user.country_name,
      company_name: this.user.company_name,
      created_at: formatDateWithoutLocal(message.created_at),
    }
  }

  public static delete(messageId: number | string, room: any, dataSource: DataSource) {
    const { db, redis } = dataSource

    redis.deleteMessage(room, messageId)

    db.deleteMessage(messageId)
  }

  public static async getOne(messageId: number | string, dataSource: DataSource): Promise<ExtendedMessage> {
    const { db } = dataSource

    const [message] = await db.getMessage(messageId)

    return message
  }

  public static _decode(body: string): string {
    return decodeURIComponent(
      Buffer.from(body, 'base64')
        .toString('binary')
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )
  }
}
