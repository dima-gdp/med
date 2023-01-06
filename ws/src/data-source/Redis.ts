import AppConfig from '../config'
import IoRedis, { RedisOptions as RedisSettings, Redis as RedisClient } from 'ioredis'
import {DbMessage, ISection} from './Db'

export type ExtendedMessage = DbMessage & {
  username: string,
  role: string | string[]
  administrator: boolean
  parent: boolean // дублирует parent_id
  city: string
  region: string
  country_name: string
  company_name: string,
  created_at: string
}

const DAY_SECS = 60 * 60 * 24

export class Redis {
  client: RedisClient
  private config: RedisSettings

  private MESSAGES_HISTORY_EXPIRY: number = 60 * 60 * 12
  private MESSAGES_LIMIT: number = 200

  constructor(config: AppConfig) {
    this.config = config.redis
    this.client = new IoRedis(this.config)
  }

  async canConnect (room: string, token: string, socketId: string): Promise<number> {
    const can = await this.client.setnx(`connect:${room}:user:${token}`, socketId)
    await this.client.expire(`connect:${room}:user:${token}`, 20)

    return can
  }

  async updateConnLock (room: string, token: string, socketId: string) {
    await this.client.set(`connect:${room}:user:${token}`, socketId, 'XX')
    await this.client.expire(`connect:${room}:user:${token}`, 20)
  }

  async clearConnLock (room: string, token: string) {
    await this.client.del(`connect:${room}:user:${token}`)
  }

  async getLockId (room: string, token: string): Promise<string | null> {
    const id = await this.client.get(`connect:${room}:user:${token}`)
    return id
  }

  addUser (user: any, token: string) {
    this.client.hset('users', token, JSON.stringify(user))
    this.client.expire('users', (60 * 60) * 12)
  }

  addUserToRoom (data: any, token: string) {
    data.viewpoint = data && data.viewpoint ? JSON.stringify(data.viewpoint) : null

    const pairs = Object.entries(data)
      .reduce((acc: Array<any>, cur: any) => [...acc, ...cur], [])

    this.client.hmset(`room:${data.room}:user:${token}`, pairs)
    this.client.expire(`room:${data.room}:user:${token}`, (60 * 60) * 4)
  }

  async incRoomConnections (room: string) {
    let connections: any = await this.client.hget(`room:${room}:connections`, 'connections')

    if (!connections) {
      connections = 0
    } else {
      connections = +connections
    }

    await this.client.hset(`room:${room}:connections`, 'connections', connections + 1)
  }

  async decRoomConnections (room: string) {
    let connections: any = await this.client.hget(`room:${room}:connections`, 'connections')

    if (!connections) {
      connections = 0
    } else {
      connections = +connections
    }

    connections = connections > 0 ? parseInt(connections) - 1 : connections
    await this.client.hset(`room:${room}:connections`, 'connections', connections)
  }

  updateRoomInfo (room: any, payload: any) {
    const { total, online } = payload

    this.client.hmset(`room:${room}:info`, [
      'online', online,
      'total', total,
    ])

    this.client.expire(`room:${room}:info`, 60 * 1)
  }

  async getRoomInfo (room: string) {
    return (await this.client.hgetall(`room:${room}:info`))
  }

  async getRoomConnections (room: string) {
    const result: any = await this.client.hgetall(`room:${room}:connections`)

    result.connections = parseInt(result.connections)

    return result
  }

  async findUserInRoom (room: string, token: string) {
    let user: any = await this.client.hgetall(`room:${room}:user:${token}`)

    if(!user || Object.keys(user).length <= 0){
      return null
    }

    if (user.viewpoint !== null) {
      user.viewpoint = JSON.parse(user.viewpoint)
    }

    user.administrator = user.administrator === 'true'

    return user
  }

  async getClientsByRoom (room: string) {
    try {
      return await this.client.hlen('room:' + room)
    } catch (e) {
      console.error(e)
      return 0
    }
  }

  async findUserByToken (token: string) {
    let data: any = await this.client.hget('users', token)
    let user = JSON.parse(data)
    return user
  }

  attachMessage (room: string, message: any) {
    return this.client.hset(`messages:attached:${room}`, message.id, JSON.stringify(message))
  }

  async getAttachedMessages (room: string) {
    let result: any[] = []

    try {
      let messages = await this.client.hgetall('messages:attached:' + room)
      if (messages) {
        for (let [, msg] of Object.entries(messages)) {
          result.push(JSON.parse(msg))
        }
      }

      return result
    } catch (e) {
      console.error(e)
    }
  }

  async getLectorMessages (room: string) {
    let result: any = []

    try {
      let messages = await this.client.hgetall('messages:lector:' + room)

      if (messages) {
        for (let [, msg] of Object.entries(messages)) {
          result.push(JSON.parse(msg))
        }
      } else {
        return result
      }
    } catch (e) {
      console.error(e)
    }

    return result
  }

  async updateLectorMessage (room: string, message: any) {
    const result: any = await this.client.lrange('messages:users:' + room, 0, -1)

    const indexToUpdate = result
      .map((r: string) => JSON.parse(r))
      .findIndex((rO: any) => rO.id === message.id)

    if (indexToUpdate === -1) {
      return
    }

    await this.client.lset('messages:users:' + room, indexToUpdate, JSON.stringify(message))
  }

  async getMessages (room: string, offset: number = 0, limit: number | null = 20) {
    const total = await this.client.llen('messages:users:' + room)
    const start = limit === null
      ? -total + 1
      : - 1 - offset - limit
    const stop = offset <= 0 ? -1 : -offset

    const messages: any = await this.client.lrange('messages:users:' + room, start, stop)
    return {
      messages: messages.map((m: any) => JSON.parse(m)),
      total: +total,
    }
  }

  async getMessagesForAdmin (room: string) {
    const result = await this.client.eval(`
      local out = {}
      local messages = redis.call('lrange', KEYS[1], 0, -1)

      for _, value in pairs(messages) do
        local m = cjson.decode(value)
        if m.administrator then
          out[#out + 1] = cjson.encode(m)
        end
      end

      return out
    `, 1, 'messages:users:' + room)

    return result
  }

  async getMessagesForLector (room: string) {
    const result = await this.client.eval(`
      local out = {}
      local messages = redis.call('lrange', KEYS[1], 0, -1)

      for _, value in pairs(messages) do
        local m = cjson.decode(value)
        if m.for_lector then
          out[#out + 1] = cjson.encode(m)
        end
      end

      return out
    `, 1, 'messages:users:' + room)

    return result
  }

  async createMessage (room: string, message: ExtendedMessage) {
    if (message.type === 'stream/chat') {
      const messages = await this.client.rpush('messages:users:' + room, JSON.stringify(message))
      await this.client.expire('messages:users:' + room, this.MESSAGES_HISTORY_EXPIRY)

      await this.client.ltrim('messages:users:' + room, -this.MESSAGES_LIMIT, -1)

      return messages
    }
  }

  async deleteMessage (room: string, id: string | number) {
    const messages: any = await this.client.lrange('messages:users:' + room, 0, -1)

    const messageToDelete = messages
      .map((m: any) => JSON.parse(m))
      .find((m: any) => +m.id === +id)

    await this.client.lrem('messages:users:' + room, 1, JSON.stringify(messageToDelete))
  }

  detachMessage (room: string, id: string) {
    return this.client.hdel('messages:attached:' + room, id)
  }

  cancelLectorMessage (room:string, message: any) {
    return this.client.hdel('messages:lector:' + room, message)
  }

  saveVoting (room: string, id: string, data: any) {
    return new Promise((resolve, reject) => {
      const { options: votingOptionsData } = data
      const votingData = Object.assign({}, data)
      delete votingData['options']

      try {
        this.client.hmset(`room:${room}:voting:${id}`, votingData)
        this.client.expire(`room:${room}:voting:${id}`, votingData.time + 30)

        if (Array.isArray(votingOptionsData)) {
          votingOptionsData.forEach(o => {
            this.client.hmset(`room:${room}:voting:${id}:option:${o.id}`, o)
            this.client.expire(`room:${room}:voting:${id}:option:${o.id}`, votingData.time + 30)
          })
        }

        resolve(null)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getVoting (room: string, id: string) {
    const votingKey = `room:${room}:voting:${id}`
    const optionsKeys = await this.client.keys(`room:${room}:voting:${id}:option:*`)

    const voting = await this.client.hgetall(votingKey)
    const options = await Promise.all(optionsKeys.map(k => this.client.hgetall(k)))
    options.sort((a, b) => +a.id - +b.id)
    return { ...voting, options }
  }

  async isThereVotingResult (room: string, poll: string, user_id: string) {
    const is = await this.client.exists(`room:${room}:voting:${poll}:result:${user_id}`)
    return is
  }

  async makeVote (room: string, data: any) {
    const { poll, option, user_id } = data

    await this.client.hmset(`room:${room}:voting:${poll}:result:${user_id}`, data)
    await this.client.expire(`room:${room}:voting:${poll}:result:${user_id}`, 24 * 60 * 60)
    await this.client.hincrby(`room:${room}:voting:${poll}:option:${option}`, 'voted', 1)
    await this.client.hincrby(`room:${room}:voting:${poll}`, 'voted', 1)
  }

  async getVoteResults (room: string, id: string) {
    const keys = await this.client.keys(`room:${room}:voting:${id}:result:*`)

    const results = await Promise.all(keys.map(k => this.client.hgetall(k)))

    return results
  }

  async registerNmoConfirm (room: string, nmoControlId: number, userId: number) {
    const createdAt = Math.round(Date.now() / 1000)

    // Структура данных для переноса в Postgres
    await this.client.hmset(
      `room:${room}:nmoControl:${nmoControlId}:user:${userId}`,
      ['userId', userId,
        'nmoControlId', nmoControlId,
        'createdAt', createdAt],
    )

    await this.client.sadd(
      `room:${room}:controls`,
      JSON.stringify({ nmoControlId, userId }),
    )
    await this.client.expire(`room:${room}:controls`, DAY_SECS)
  }

  async isUserConfirmNmoControl (room: string, nmoControlId: number, userId: number) {
    const value = JSON.stringify({ nmoControlId, userId })
    const is = await this.client.sismember(`room:${room}:controls`, value)
    return 1 === is
  }

  async addNmoControl (room: string, nmoControlId: number) {
    await this.client.sadd(`room:${room}:controlIdList`, nmoControlId)
    await this.client.expire(`room:${room}:controlIdList`, DAY_SECS)
  }

  async getNmoControlSet (room: string) {
    return await this.client.smembers(`room:${room}:controlIdList`)
  }

  async saveActiveSection (room: string, section: ISection) {
    await this.client.set(`room:${room}:current-section`, JSON.stringify(section))
    await this.client.expire(`room:${room}:current-section`, 12 * 60 * 60)
  }

  async getActiveSection (room: string) {
    const activeSection = await this.client.get(`room:${room}:current-section`)

    if (!activeSection) {
      return null
    }

    return JSON.parse(activeSection) as ISection
  }
}
