import { FastifyInstance } from 'fastify'
import { createMealSchema } from '../models/create-meal-schema'
import { knex } from '../database'
import { randomUUID } from 'crypto'
import { formattedDate } from '../utils/date'

interface Params {
  userId: string
  id: string
}
export async function mealsRoutes(app: FastifyInstance) {
  app.get<{ Params: Params }>('/user/:userId/meals', async (request) => {
    const { userId } = request.params

    const meals = await knex('meals').where({ user_id: userId })
    return { meals }
  })

  app.get<{ Params: Params }>('/meal/:id', async (request) => {
    const { id } = request.params
    const meal = await knex('meals').where({ id }).select().first()

    return { meal }
  })

  app.post<{ Params: Params }>('/user/:userId/meal', async (request, reply) => {
    const { name, description, dateAndTime, isPartOfDiet } =
      createMealSchema.parse(request.body)
    const { userId } = request.params

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date_and_time: formattedDate(dateAndTime),
      is_part_of_diet: isPartOfDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })
  app.put<{ Params: Params }>('/meal/:id', async (request, reply) => {
    const { id } = request.params
    const { name, description, dateAndTime, isPartOfDiet } =
      createMealSchema.parse(request.body)

    await knex('meals')
      .where({ id })
      .update({
        name,
        description,
        is_part_of_diet: isPartOfDiet,
        date_and_time: formattedDate(dateAndTime),
      })

    return reply.status(200).send()
  })
}
