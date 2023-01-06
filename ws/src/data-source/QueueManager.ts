import Bull from 'bull'
import IoRedis, { RedisOptions as RedisConfig, Redis } from 'ioredis'
import {Pool} from 'pg'

export class QueueManager {
  private readonly prefix: string | undefined = process.env.BULL_PREFIX
  private readonly _insertDbQueue: Bull.Queue

  private pool: Pool

  private readonly redisClient: Redis
  private readonly redisSubscriber: Redis

  constructor(redisConfig: RedisConfig, Pool: Pool) {
    this.redisClient = new IoRedis(redisConfig)
    this.redisSubscriber = new IoRedis(redisConfig)

    this.pool = Pool

    this.pool.on('error', err => {
      console.error('PostgreSQL client generated error: ', err.message)
    })

    this._insertDbQueue = new Bull('insertDb', {
      prefix: this.prefix,
      createClient: (type: any) => {
        switch (type) {
        case 'client':
          return this.redisClient
        case 'subscriber':
          return this.redisSubscriber
        default:
          return new IoRedis(redisConfig)
        }
      },
    })

    this._insertDbQueue.process(this.insertDbProcess.bind(this))
  }

  private async insertDbProcess (job: Bull.Job) {
    const { query, params } = job.data
    try {
      console.log(query, '\n', params)
      await this.pool.query(query, params)
    } catch (e) {
      throw new Error(e)
    }
  }

  get insertDb (): Bull.Queue {
    return this._insertDbQueue
  }
}
