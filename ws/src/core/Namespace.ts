import type {
  Server as IoServer,
  Namespace as IoNamespace,
} from 'socket.io'

export class Namespace {
  protected io: IoServer
  protected nsp: IoNamespace
  protected dataSource: any
  protected path: string

  constructor(path: string, io: IoServer, dataSource: any, middlewares: Array<any> = []) {
    this.path = path
    this.io = io
    this.dataSource = dataSource
    this.nsp = this.io.of(path)

    middlewares.forEach(m => {
      this.nsp.use(m)
    })
  }
}
