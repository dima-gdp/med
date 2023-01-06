import fs from 'fs'
import express from 'express'
import cors from 'cors'
import * as http from 'http'
import * as https from 'https'
import {Server} from 'socket.io'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { PrometheusSocketIo } from 'socket.io-prometheus-v3'
import  {createAdapter} from 'socket.io-redis'
import userMiddleware from './middlewares/user'
import { DataSource } from './data-source'

import AppConfig from './config'

// @ts-ignore
import healthcheck from 'express-healthcheck'


Sentry.init({
  dsn: process.env.WS_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
  ],
  environment: process.env.ENV,
})

import {
  Stream as StreamNsp,
  StreamsInfo as StreamsInfoNsp,
} from './namespaces'

export class WsServer {
  private config: AppConfig = new AppConfig()
  private app: express.Application
  private server: http.Server | https.Server
  private prometheus: PrometheusSocketIo
  private io: Server
  private dataSource: DataSource
  private sslCredentials: object

  constructor() {
    this.init()
  }

  private init() {
    this.app = express()
    // @ts-ignore
    this.app.use(cors())
    // @ts-ignore
    this.app.use(Sentry.Handlers.errorHandler())
    // @ts-ignore
    this.app.use('/healthcheck', healthcheck())

    this.server = http.createServer(this.app)

    this.dataSource = new DataSource(this.config)

    const redisAdapter =  createAdapter({
      pubClient: this.dataSource.pub,
      subClient: this.dataSource.sub,
    })

    this.io = new Server(this.server, {
      adapter: redisAdapter,
      pingInterval: 5000,
      allowEIO3: true,
    })

    this.prometheus = PrometheusSocketIo.init({
      // @ts-ignore
      io: this.io.of('/stream'),
      collectDefaultMetrics: true,
    })
  }

  public run() {
    const { io, dataSource } = this

    this.app.get('/metrics', async (req, res) => {
      res.send(await this.prometheus.getMetrics())
    })

    new StreamNsp(
      '/stream',
      io,
      dataSource,
      [userMiddleware(dataSource)],
    ).handleConnection()

    new StreamsInfoNsp(
      '/streams-info',
      io,
      dataSource,
    ).handleConnection()

    this.server.listen(
      this.config.app.port,
      () => console.log('Running server on port %s', this.config.app.port),
    )
  }

  public getApp(): express.Application {
    return this.app
  }
}
