import { Namespace } from '../../core/Namespace'
// TODO: Переписать NMO интервалы на v2
import { IntervalEmitter } from './utils/IntervalEmitter'
import { IntervalEmitter as IntervalEmitterV2 } from './utils/IntervalEmitter.v2'

import {
  StreamService,
  ChatService,
  VotingService,
  NmoService,
} from './services'

export class Stream extends Namespace {
  public handleConnection() {
    const nmoInterval = new IntervalEmitter('nmoTick')
    const votingInterval = new IntervalEmitterV2('votingTick')

    const intervalStorage = new Map()

    this.dataSource.sub.subscribe('voting')
    this.dataSource.sub.subscribe('external_voting')

    this.dataSource.sub.on('message', async (channel: string, message: string) => {
      if (channel === 'voting') {
        const { cmd, room } = JSON.parse(message)

        switch (cmd) {
        case 'start':
          break
        case 'stop':
          if (intervalStorage.has(room)) {
            intervalStorage.get(room).forceRemaining()
          }
          break
        default:
          break
        }
      }

      if (channel === 'external_voting') {
        const { room, poll } = JSON.parse(message)
        const [streamVoting] = await this.dataSource.db.getStreamVotingData(poll)
          .catch((e: string) => {
            throw new Error(e)
          })

        await this.dataSource.redis.saveVoting(room, poll, streamVoting)
        this.nsp.to(String(room)).emit('externalVoting', { room, poll })
      }
    })

    this.nsp.on('connection', async (socket: any) => {
      const { dataSource, io } = this
      const { token, room } = socket.handshake.query
      const user = await dataSource.redis.findUserInRoom(room, token)

      if (!user) {
        socket.emit('no auth')
        return
      }

      socket.conn.on('packet', async () => {
        const lockId = await dataSource.redis.getLockId(room, token)

        if (lockId === socket.id) {
          await dataSource.redis.updateConnLock(room, token, socket.id)
        }
      })

      socket.on('disconnect', async (reason: string) => {
        const lockId = await dataSource.redis.getLockId(room, token)

        if (lockId === socket.id) {
          await dataSource.redis.clearConnLock(room, token)
        }
      });

      [
        new StreamService({ dataSource, socket, user }),
        new ChatService({ dataSource, socket, user }),
        new VotingService({ dataSource, socket, io, user, interval: votingInterval, intervalStorage }),
        new NmoService({ dataSource, socket, user, interval: nmoInterval }),
      ].map(s => s.handleEvents())

      socket.on('join', async () => {
        const [{ single_connection }] = await dataSource.db.getStreamData(room)
        const canConnect = await dataSource.redis.canConnect(room, token, socket.id)

        console.log('join', { single_connection, canConnect })

        if (single_connection && !canConnect) {
          socket.emit('alreadyConnected', { room, token })
        }
      })

      socket.on('switchConnectionLock', async () => {
        const lockId = await dataSource.redis.getLockId(room, token)
        await dataSource.redis.updateConnLock(room, token, socket.id)

        socket.nsp.to(lockId).emit('alreadyConnected', { room, token })
        socket.emit('switchConnectionLockSuccess')
      })

      socket.emit('ready')
    })
  }
}
