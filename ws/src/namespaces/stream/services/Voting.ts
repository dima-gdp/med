import { IntervalEmitter } from '../utils/IntervalEmitter.v2'
import {Service, SocketService } from '../../../core/Service'

export class Voting extends Service implements SocketService {
  interval: IntervalEmitter
  io: any

  public handleEvents(): void {
    this.socket
      .on('votingStart', this.onVotingStart.bind(this))
      .on('votingRestart', this.onVotingRestart.bind(this))
      .on('votingStop', this.onVotingStop.bind(this))
      .on('makeVote', this.onMakeVote.bind(this))
      .on('updateVotes', this.updateVotes.bind(this))
  }

  private async onVotingStart(id: any): Promise<any> {
    try {
      const room = this.room

      const { administrator } = this.user

      if (!this.intervalStorage?.has(this.room)) {
          this.intervalStorage?.set(room, this.interval)
      }

      await this.dataSource.pub.publish('voting', JSON.stringify({ cmd: 'start', room }))

      const interval = this.intervalStorage?.get(room)

      if (administrator && interval && !interval.isRunning) {
        const [{ time }] = await this.db.startVote(id)
          .catch((e: string) => {
            throw new Error(e)
          })

        const [streamVoting] = await this.db.getStreamVotingData(id)
          .catch((e: string) => {
            throw new Error(e)
          })

        await this.redis.saveVoting(room, id, streamVoting)

        const now = Math.floor(Date.now() / 1000)

        interval
          .on('votingTick', async (data: any) => {
            const [voting, results] = await Promise.all([this.redis.getVoting(room, id), this.redis.getVoteResults(room, id)])
            this.socket.nsp.to(room).emit('votingTick', { ...data, voting, results })
          })
          .on('votingTick:additional', async (data: any) => {
            const [voting, results] = await Promise.all([this.redis.getVoting(room, id), this.redis.getVoteResults(room, id)])
            this.socket.nsp.to(room).emit('votingTickAdditional', { ...data, voting, results })
          })
          .on('votingTick:start', async () => {
            const [voting, results] = await Promise.all([this.redis.getVoting(room, id), this.redis.getVoteResults(room, id)])
            this.socket.nsp.to(room).emit('votingStart', { voting, results })
          })
          .on('votingTick:stop', async () => {
            await this.onVotingStop(id)
              this.intervalStorage?.delete(room)
              this.socket.nsp.to(room).emit('votingEnd', id)
          })

        interval.start(
          {
            tick: 1,
            from: now,
            to: now + time,
            add: 30,
          },
        )
      }
    } catch (e){
      this.socket.emit('voting:error',JSON.stringify(e))
      throw new Error(`On voting start error: ${e}`)
    }
  }

  private async onVotingRestart(id: any): Promise<any> {
    const room = this.room

    const { administrator } = this.user

    try {
      if (administrator) {
        await this.db.restartVote(id)
          .catch((e: string) => {
            throw new Error(e)
          })

        await this.onVotingStart(id)

        this.socket.nsp.to(room).emit('votingRestart', id)
      }
    } catch (e){
      this.socket.emit('voting:error',JSON.stringify(e))
      throw new Error(`On voting restart error: ${e}`)
    }
  }

  private async onVotingStop(id: any): Promise<any> {
    const room = this.room
    const { administrator } = this.user
    try {
      await this.dataSource.pub.publish('voting', JSON.stringify({cmd: 'stop', room}))

      if (administrator) {
        await this.db.endVote(id)
          .catch((e: string) => {
            throw new Error(e)
          })
      }

      this.socket.nsp.to(room).emit('votingEnded', id)
    }catch (e){
      this.socket.emit('voting:error',JSON.stringify(e))
      throw new Error(`On voting stop error: ${e}`)
    }
  }

  private async onMakeVote(data: any): Promise<any> {
    const room = this.room

    const isAlreadyVoted = await this.redis.isThereVotingResult(room, data.poll, data.user_id)

    const EXISTED_CODE = 1
    // const NON_EXISTED_CODE = 0

    if (isAlreadyVoted === EXISTED_CODE) {
      return
    }

    await this.db.makeVote(data, this.user)
      .catch((e: string) => {
        throw new Error(e)
      })

    await this.redis.makeVote(room, data)

    this.socket.nsp.to(room).emit('make_vote', data)
  }

  private updateVotes(data: any): void {
    const room = this.room
    this.socket.nsp.to(room).emit('updateVotes', data)
  }
}
