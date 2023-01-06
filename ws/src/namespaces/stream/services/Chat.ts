import { Service } from '../../../core/Service'
import { formatDate } from '../../../core/utils'
import { Message } from '../models'

export class Chat extends Service {
  public handleEvents(): void {
    this.socket
      .on('join', this.onJoin.bind(this))
      .on('message', this.onMessage.bind(this))
      .on('delete message', this.onDeleteMessage.bind(this))
      .on('send lector', this.onSendLector.bind(this))
      .on('cancel lector', this.onCancelLector.bind(this))
      .on('attach message', this.onAttachMessage.bind(this))
      .on('detach message', this.onDetachMessage.bind(this))
      .on('getMessagesForLector', this.onLectorHistory.bind(this))
      .on('history:messages:get', this.getMessages.bind(this))
      .on('history:attached:get', this.getAttached.bind(this))
  }

  private async onJoin(data: any): Promise<any> {
    // await this.getAttached()
  }

  private async getMessages (offset: number = 0, limit: number | null = 200) {
    const room = this.room
    const { administrator, role } = this.user

    const source = administrator || role.includes('lector')
      ? this.db
      : this.redis

    let { messages, total } = await source.getMessages(room, offset, limit)

    messages = messages.map((m: any) => ({
      ...m,
      created_at: formatDate(m.created_at),
      administrator: [
        'manager',
        'editor',
        'administrator',
        'moderator',
      ].some(role => m.role.includes(role)),
    }))

    this.socket.emit('history:messages', { messages, total })
  }

  private async getAttached () {
    const room = this.room

    const messages = await this.redis.getAttachedMessages(room)

    this.socket.emit('history:attached', messages)
  }

  private async onLectorHistory (data: any) {
    const room = this.room

    const history = await this.db.getLectorMessages(+room)

    this.socket.emit('messagesForLector', history)
  }

  private async onMessage(data: any) {
    const room = this.room

    const message = new Message(this.user, data, this.dataSource)
    const savedMessage = await message.save('stream/chat')

    savedMessage.created_at = formatDate(savedMessage.created_at)

    this.socket.nsp.to(room).emit('new message', savedMessage)
  }

  private async onAttachMessage(data: any) {
    const room = this.room

    const message = new Message(this.user, data, this.dataSource)
    const savedMessage = await message.save('stream/attach')

    await this.redis.attachMessage(room, savedMessage)

    this.socket.nsp.to(room).emit('attach message', savedMessage)
  }

  private async onDetachMessage(messageId: string) {
    const room = this.room
    const { administrator } = this.user

    if (administrator) {
      try {
        await Message.delete(messageId, room, this.dataSource)
        await  this.redis.detachMessage(room, messageId)
      } catch (e) {
        throw new Error(e)
      }

      this.socket.nsp.to(room).emit('detach message', messageId)
    }
  }

  private async onDeleteMessage(messageId: number) {
    const room = this.room
    const { administrator } = this.user

    if (administrator) {
      await Promise.all([Message.delete(messageId, room, this.dataSource), this.redis.cancelLectorMessage(room, messageId)])
        .catch((e: string) => {
          throw new Error(e)
        })

      this.socket.nsp.to(room).emit('delete message', messageId)
    }
  }

  private async onSendLector(id: any) {
    if (!this.user.administrator) {
      return
    }

    const room = this.room

    await this.db.sendLector(id)
    const message = await Message.getOne(id, this.dataSource)

    message.created_at = formatDate(message.created_at)

    this.socket.nsp.to(room).emit('send lector', message)
    await this.redis.updateLectorMessage(room, message)
  }

  private async onCancelLector(id: any) {
    if (!this.user.administrator) {
      return
    }

    const room = this.room

    await this.db.cancelLector(id)
    const message = await Message.getOne(id, this.dataSource)

    this.socket.nsp.to(room).emit('cancel lector', id)

    await this.redis.updateLectorMessage(room, message)
  }
}
