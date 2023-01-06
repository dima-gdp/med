import {Service, SocketService } from '../../../core/Service'
import { IntervalEmitter } from '../utils/IntervalEmitter'
import { toUnixTime } from '../../../core/utils'

export class Nmo extends Service implements SocketService {
  interval: IntervalEmitter

  public handleEvents(): void {
    this.socket
      .on('createNmoControl', this.onCreateNmoControl.bind(this))
      .on('nmoConfirm', this.onNmoConfirm.bind(this))
      .on('nmoConfirmStatus', this.onNmoConfirmStatus.bind(this))
      .on('currentNmoConfirmStatus', this.onCurrentNmoConfirmStatus.bind(this))
  }

  private async onCreateNmoControl(data: any): Promise<any> {
    const room = this.room
    const { administrator } = this.user
    const { nmo_material_id } = data

    if (administrator) {
      const [nmoControl] = await this.db.createNmoControl(nmo_material_id)
        .catch((e: string) => {
          throw new Error(e)
        })

      await this.redis.addNmoControl(room, nmoControl.id)

      const modalStarted = toUnixTime(nmoControl.created_at)

      this.socket.nsp.to(room).emit('createNmoControl', {
        id: nmoControl.id,
        created_at: modalStarted,
      })

      const payload = {
        room,
        lastControl: nmoControl.created_at,
        nmoControlId: nmoControl.id,
      }

      this.interval?.start(this.socket, payload)
    }
  }

  private async onNmoConfirm (nmoControlId: number) {
    const room = this.room

    await this.redis.registerNmoConfirm(room, +nmoControlId, +this.user.user_id)

    await this.onNmoConfirmStatus()

    console.info(`[NMO-INFO📝] Confirm registered: room ${room}, nmoControlId ${nmoControlId}, userId ${this.user.user_id}`)
  }

  private async onNmoConfirmStatus () {
    const status = await this.getUserControlNmoStatus()

    this.socket.emit('nmoConfirmStatus', status)
  }

  private async getUserControlNmoStatus () {
    const room = this.room
    const userId = this.user.user_id

    const controlIds: string[] = await this.redis.getNmoControlSet(room)

    const confirmPromises = controlIds.map(
      nmoControlId => this.redis.isUserConfirmNmoControl(room, +nmoControlId, +userId),
    )

    const confirmedControls = (await Promise.all(confirmPromises))
      .filter(isConfirmed => isConfirmed)

    const all = controlIds.length
    const confirmed = confirmedControls.length
    const missed = all - confirmed

    if (missed < 0) {
      throw new Error('Ошибка в расчете количества подтверждений НМО')
    }

    return { all, confirmed, missed }
  }

  private async onCurrentNmoConfirmStatus (nmoControlId: number) {
    const room = this.room
    const userId = this.user.user_id

    const isConfirmed = await this.redis.isUserConfirmNmoControl(room, +nmoControlId, +userId)

    this.socket.nsp.to(room).emit('currentNmoConfirmStatus', { isConfirmed })
  }
}
