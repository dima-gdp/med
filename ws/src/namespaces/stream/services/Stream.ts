import { Service, SocketService } from '../../../core/Service'
import { formatDate } from '../../../core/utils'
import { Section } from '../domain/Section'

// TODO: вынести глобальнее
enum STREAM_STATUS {
  CREATED,
  STARTED,
  STOPPED,
  ENDED
}

export class Stream extends Service implements SocketService {
  public handleEvents(): void {
    const room = this.room

    this.socket
      .on('join', this.onJoin.bind(this))
      .on('disconnect', this.onDisconnect.bind(this))
      .on('status', this.onStatus.bind(this))
      .on('getInfo', this.roomInfo.bind(this, room))
      .on('get-current-section', this.getCurrentSection.bind(this))
      .on('section-end', this.onUpdateSection.bind(this))
  }

  private async onJoin(data: any) {
    const room = this.room
    console.log(`User: ${this.user.user_id} joined!`)
    this.socket.join(room)
    await this.redis.incRoomConnections(room)
    // await this.roomInfo(room)
  }

  private async onDisconnect(data: any): Promise<any> {
    const room = this.room

    await this.redis.decRoomConnections(room)

    try {
      if (this.user.viewpoint) {
        await this.db.viewPointEnded(this.user.viewpoint.id)
        await this.db.endInvitedViewpoints(this.user.viewpoint.id)
      }
    } catch (e) {
      throw new Error(e)
    }

    console.log(`User: ${this.user.user_id} disconnected!`)
    console.log(`Leave room: ${room}`)

    this.socket.leave(room)

    // await this.roomInfo(room)
  }

  // TODO: Каждый клиент запрашивает раз в 30 сек инфу, нужно переделать сервер
  private async roomInfo(room: string): Promise<any> {
    try {
      let info = await this.redis.getRoomInfo(room)
      let connections = await this.redis.getRoomConnections(room)

      if(!info || Object.keys(info).length <= 0){
        const [{ total, online }] = await this.db.getUsersCounter(room)

        info = { total, online }

        await this.redis.updateRoomInfo(room, info)
      }

      this.socket.emit('info', { ...info, ...connections })
    } catch (e) {
      throw new Error(e)
    }
  }

  private async onStatus(status: STREAM_STATUS) {
    const room = this.room
    const { administrator } = this.user

    if (!administrator) {
      throw new Error('Только администратор может менять статус')
    }

    if (status === STREAM_STATUS.STARTED) {
      const timeFieldToUpdate = 'started_at'
      const convertedTime = await this.processStreamStatus(status, +room, timeFieldToUpdate)

      const firstSection = await this.db.updateStartedAtAndReturnFirstSection(room)

      await this.redis.saveActiveSection(room, firstSection)

      this.socket.nsp.to(room).emit('status', { status, ...convertedTime } )
      return
    }

    if (status === STREAM_STATUS.ENDED) {
      const timeFieldToUpdate = 'ended_at'
      const convertedTime = await this.processStreamStatus(status, +room, timeFieldToUpdate)
      const now = Math.round(Date.now() / 1000)

      const currentSection = await Section.getCurrentSection(this.db, this.redis, room)

      await this.db.updateSectionEndTime(currentSection.id, now)

      this.socket.nsp.to(room).emit('status', { status, ...convertedTime } )
      return
    }

    if (status === STREAM_STATUS.CREATED || status == STREAM_STATUS.STOPPED) {
      // Бизнес логика: обновить статус из самой трансляции можно только
      // в состояние "запущено" или в состояние "завершено"
      // состояние "создано" или "остановлено" можно сменить только из админки
      throw new Error('Ошибка обновления статуса трансляции')
    }

    throw new Error('Неизвестный статус')
  }

  private async processStreamStatus (
    status: STREAM_STATUS,
    room: number,
    timeFieldToUpdate: string,
  ) {
    const [time] = await this.db.updateStreamStatusAndGetTime(status, room, timeFieldToUpdate)

    const convertedTime = formatDate(time[timeFieldToUpdate])
    console.log(`статус трансляции ${room} изменен на ${status}`)
    console.log(`${timeFieldToUpdate} = ${convertedTime}`)

    return { [timeFieldToUpdate]: convertedTime }
  }

  private async onUpdateSection (sectionId: number) {
    if (!this.user.administrator) {
      return
    }

    const room = this.room
    const section = await this.db.getLastSection(room)

    if (section.id !== sectionId) {
      throw new Error('Не совпадает id новой секции!')
    }

    await this.redis.saveActiveSection(room, section)

    this.socket.nsp.to(room).emit('new-section', section )
  }

  async getCurrentSection () {
    const room = this.room
    const section = await Section.getCurrentSection(this.db, this.redis, room)
    console.log(section)
    this.socket.nsp.to(room).emit('get-current-section', section )
  }
}
