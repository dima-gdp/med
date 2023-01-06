import type { DataSource } from '../data-source'
import type { Socket, Server as IoServer } from 'socket.io'
import { IntervalEmitter } from '../namespaces/stream/utils/IntervalEmitter'
import { IntervalEmitter as IntervalEmitterV2 } from '../namespaces/stream/utils/IntervalEmitter.v2'
import { Db } from '../data-source/Db'
import { Redis } from '../data-source/Redis'

type ServiceConfig = {
  dataSource: DataSource
  socket: Socket
  io?: IoServer | undefined
  user: any
  interval?: IntervalEmitter | IntervalEmitterV2
  intervalStorage?: Map<string, IntervalEmitterV2>
}

export interface SocketService {
  handleEvents: () => void
}
// todo: разобраться со структурой, нафига тут абстрактный класс и тд
export abstract class Service {
  protected db: Db
  protected redis: Redis
  protected socket: Socket
  protected io: IoServer | undefined
  protected user: any
  protected room: string
  protected token: string
  protected dataSource: DataSource
  protected interval?: IntervalEmitter | IntervalEmitterV2
  protected intervalStorage?: Map<string, IntervalEmitterV2>

  protected services: { [key: string]: Service } = {}

  constructor(config: ServiceConfig) {
    const { dataSource, socket, user, interval, io, intervalStorage } = config
    const queryToken = socket.handshake.query?.token
    const queryRoom = socket.handshake.query?.room

    if(typeof queryToken != 'string') throw Error('Token is not string')
    if(typeof queryRoom != 'string') throw Error('QueryRoom is not string')

    const token: string = queryToken.toString()
    const room: string = queryRoom.toString()

    this.dataSource = dataSource
    this.redis = dataSource.redis
    this.db = dataSource.db
    this.socket = socket
    this.io = io
    this.user = user
    this.room = room
    this.token = token
    this.interval = interval
    this.intervalStorage = intervalStorage
  }

  public inject(...args: Array<Service>) {
    args.forEach(service => {
      this.services['$' + service.constructor.name] = service
    })

    const strServicesName = args.reduce((acc, current) => {
      acc += current.constructor.name + ' '
      return acc
    }, '').trim()

    console.log(`Services [${strServicesName}] injected to [${this.constructor.name}]`)
  }
}
