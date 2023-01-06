const insertDbQueue = require('./index')

const { Client } = require('pg')
import config from '../config'

insertDbQueue.process(async (job, done) => {
  const client = new Client(config.db)

  try {
    await client.connect()
    await client.query(job.data.query, job.data.params)

    done()

    await client.end()
  } catch (e) {
    throw new Error(e)
  }
})
