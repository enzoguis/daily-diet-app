import { Knex, knex as setupKnex } from 'knex'
import 'dotenv/config'
import { env } from './models/env-schema'

console.log('DATABASE_CLIENT:', env.DATABASE_CLIENT)
console.log('DATABASE_URL:', env.DATABASE_URL)

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
