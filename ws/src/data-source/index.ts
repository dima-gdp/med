import AppConfig from '../config'

import { Db } from './Db'
import { Redis } from './Redis'

import IoRedis, { Redis as RedisClient } from 'ioredis'

export class DataSource {
  private readonly config: AppConfig

  private readonly _db: Db
  private readonly _redis: Redis

  private readonly _pub: RedisClient
  private readonly _sub: RedisClient

  constructor(config: AppConfig) {
    this.config = config

    this._db = new Db(this.config)
    this._redis = new Redis(this.config)

    this._pub = new IoRedis(this.config.redis)
    this._sub = new IoRedis(this.config.redis)
  }

  get db(): Db {
    return this._db
  }

  get redis(): Redis {
    return this._redis
  }

  get pub(): RedisClient {
    return this._pub
  }

  get sub(): RedisClient {
    return this._sub
  }
}

export default DataSource
