import { Namespace } from '../../core/Namespace'
import type { Socket } from 'socket.io'
import { formatDate, toUnixTime } from '../../core/utils'

export class StreamsInfo extends Namespace {
  private db = this.dataSource.db

  public handleConnection() {
    this.nsp.on('connection', async (socket) => {
      socket.on('streamsInfo', this.onStreamsInfo.bind(this, socket))
    })
  }

  private async onStreamsInfo(socket: Socket) {
    const data = (
      await this.db.getStreamsInfo()
        .catch((e: string) => {
          throw new Error(e)
        })
    )
      .map((i: any) => ({
        ...i,
        startedAt: formatDate(i.started_at),
        unixStartedAt: toUnixTime(i.started_at),
      }))

    socket.nsp.emit('streamsInfoData', data)
  }
}
