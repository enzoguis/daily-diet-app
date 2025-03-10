import { Knex, knex as setupKnex } from 'knex'
import 'dotenv/config'
import { env } from './models/env-schema'

const databaseConnection =
  env.DATABASE_CLIENT === 'sqlite'
    ? { filename: env.DATABASE_URL }
    : env.DATABASE_URL

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: databaseConnection,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
