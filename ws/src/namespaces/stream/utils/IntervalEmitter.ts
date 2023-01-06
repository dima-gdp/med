import type { Socket } from 'socket.io'

type IntervalConfig = {
  tick: number
  timeout: number
}

export class IntervalEmitter {
  private intervalsStorage: { [key: string]: any } = {}
  private readonly type: string
  private readonly tick: number = 1
  private readonly timeout: number = 300

  constructor(intervalType: string, config?: IntervalConfig) {
    this.type = intervalType

    if (config) {
      this.tick = config?.tick
      this.timeout = config?.timeout
    }
  }

  public stop(room: string) {
    if (this.intervalsStorage[room]) {
      clearInterval(this.intervalsStorage[room].timer)
      delete this.intervalsStorage[room]
    }
  }

  public start(socket: Socket, payload: any): NodeJS.Timer | void {
    const { room, lastControl } = payload

    if (this.intervalsStorage[room]) {
      return
    }

    const END = lastControl.getTime() + (this.timeout + 3 * 60 * 60) * 1000
    const NOW = new Date().getTime()

    if (NOW > END) {
      return
    }

    this.intervalsStorage[room] = { timer: null, remaining: 0 }
    this.intervalsStorage[room].remaining = Math.floor((END - NOW) / 1000)

    this.intervalsStorage[room].timer = setInterval(() => {
      socket.nsp.to(room).emit(
        this.type,
        { remainingTime: this.intervalsStorage[room].remaining, payload },
      )

      this.intervalsStorage[room].remaining--

      if (this.intervalsStorage[room].remaining < 0) {
        this.stop(room)
        // todo: этому место в .stop
        socket.nsp.to(room).emit(
          this.type + ':stopped',
        )
      }
    }, this.tick * 1000)

    return this.intervalsStorage[room].timer
  }
}
