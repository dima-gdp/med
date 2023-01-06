import { WsServer } from './server'

process.env.TZ = 'Europe/Moscow'
new WsServer().run()
