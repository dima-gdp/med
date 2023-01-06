import { EventEmitter } from 'events'

type IntervalConfig = {
  tick: number
  from: number
  to: number
  add: number
}

export class IntervalEmitter extends EventEmitter {
  private intervalRef: NodeJS.Timer | undefined
  private readonly type: string
  private tick: number
  private from: number
  to: number
  add: number
  private now: number = 0

  constructor(type: string) {
    super()
    this.type = type
  }

  get isRunning () {
    return !!this.intervalRef
  }

  get isAdditionalInProgress () {
    if (!this.add) {
      return false
    }
    console.log({ from: this.from, rem: this.remainingTime, add: this.add })
    return (this.remainingTime <= this.add)
  }

  get remainingTime () {
    const to = this.add + this.to

    if (this.now <= 0 || this.now > to) {
      return 0
    }

    return Math.floor(to - this.now)
  }

  forceRemaining () {
    this.to = this.now
  }

  start(config: IntervalConfig, payload?: any) {
    if (this.isRunning) {
      console.log('Can\'t run another interval, till current still in progress.', this)
      return
    }

    this.tick = config.tick
    this.to = config.to
    this.from = config.from
    this.add = config.add || 0

    this.emit(`${this.type}:start`)
    this.intervalRef = setInterval(this.pipeline.bind(this, payload), this.tick * 1000)

    return this
  }

  stop() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef)
      this.emit(`${this.type}:stop`)
      this.removeAllListeners()
      this.intervalRef = undefined
    }

    return this
  }

  pipeline (payload: any) {
    this.now = Math.floor(Date.now() / 1000)

    this.isAdditionalInProgress
      ? this.emit(`${this.type}:additional`, { remainingTime: this.remainingTime, payload })
      : this.emit(this.type, { remainingTime: this.remainingTime, payload })

    if (this.remainingTime <= 0) {
      this.stop()
    }
  }
}
