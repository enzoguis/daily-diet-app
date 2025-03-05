import { randomUUID } from 'crypto'
import { app } from '../app'
import { knex } from '../database'
import { CreateUserSchema } from '../models/create-user-schema'
import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()
    return { users }
  })

  app.post('/', async (request, reply) => {
    const { name } = CreateUserSchema.parse(request.body)
    console.log(name)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })

    return reply.status(201).send()
  })
}
