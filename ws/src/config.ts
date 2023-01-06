import fs from 'fs'
import { PoolConfig as PgSettings } from 'pg'
import { RedisOptions as RedisSettings } from 'ioredis'
const ENV_NAMES = Object.freeze({
  PROD: 'prod',
  STAGE: 'stage',
  APP_REVIEW: 'review',
  LOCAL: 'local',
})

interface AppSettings {
  port: number | undefined,
  ssl?: {
    key: string,
    cert: string,
    ca: string,
  }
}

export default class Config {
  public readonly app: AppSettings
  public readonly db: PgSettings
  public readonly redis: RedisSettings

  constructor () {
    this.app = {
      port: <number | undefined>process.env.WS_PORT,
    }
    this.db = {
      user: process.env.POSTGRES_USER,
      host: process.env.DB_HOST,
      // Для локальной разработки
      // host: '127.0.0.1',
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: <number | undefined>process.env.POSTGRES_PORT,
      max: 100,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 120000,
    }
    this.redis = {
      password: process.env.REDIS_PASSWORD,
      host: process.env.REDIS_HOST,
      port: <number | undefined>process.env.REDIS_PORT,
    }
    if ([ENV_NAMES.PROD, ENV_NAMES.STAGE].includes(process.env.ENV as string)) {
      this.db.ssl = {
        rejectUnauthorized: false,
        ca: fs.readFileSync('/root/.postgresql/root.crt').toString(),
      }
    }
    // TODO: сделать нормальные env
    // if (process.env.ENV === ENV_NAMES.LOCAL) {
    //   this.redis.sentinels = undefined
    //   this.redis.name = undefined
    //   this.redis.host = '127.0.0.1'
    //   this.redis.port = 6379
    //   this.redis.password = process.env.REDIS_PASSWORD
    //   this.db.host = '127.0.0.1'
    // }

    if(process.env.DEBUG){
      console.info(this.db)
      console.info(this.redis)
    }
  }
}
