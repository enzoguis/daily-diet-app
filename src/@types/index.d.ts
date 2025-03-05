import { Knex } from 'knex'
import { Params } from './params'

declare module 'knex/types/tables' {
  interface Tables {
    users: {
      id: string
      name: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      date_and_time: string
      is_part_of_diet: string
    }
  }
}
