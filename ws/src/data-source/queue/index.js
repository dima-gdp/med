import config from '../config.js'

const  Bull = require('bull')

const options = config

const Redis = require('ioredis')

const client = new Redis(options.redis)
const subscriber = new Redis(options.redis)
const prefix = process.env.BULL_PREFIX
let opts = {
  prefix: prefix,
  createClient: function (type) {
    switch (type) {
    case 'client':
      return client
    case 'subscriber':
      return subscriber
    default:
      return new Redis(options.redis)
    }
  },
}

module.exports = new Bull('insert db ', opts)
