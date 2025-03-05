import { Knex, knex as setupKnex } from 'knex'
import 'dotenv/config'
import { env } from './models/env-schema'

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
