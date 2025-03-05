import { FastifyInstance } from 'fastify'
import { createMealSchema } from '../models/create-meal-schema'
import { knex } from '../database'
import { randomUUID } from 'crypto'

interface Params {
  userId: string
  mealId: string
}
export async function mealsRoutes(app: FastifyInstance) {
  app.get<{ Params: Params }>('/user/:userId/meals', async (request) => {
    const { userId } = request.params
    console.log(typeof request.params)

    const meals = await knex('meals').where({ user_id: userId })
    return { meals }
  })

  app.get<{ Params: Params }>('/user/:userId/meal/:mealId', async (request) => {
    const { userId, mealId } = request.params
    const meal = await knex('meals')
      .where({ user_id: userId, id: mealId })
      .select()
      .first()

    return { meal }
  })

  app.post<{ Params: Params }>('/user/:userId/meal', async (request, reply) => {
    const { name, description, dateAndTime, isPartOfDiet } =
      createMealSchema.parse(request.body)
    const { userId } = request.params

    const formattedDate = new Date(dateAndTime).toLocaleString()

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date_and_time: formattedDate,
      is_part_of_diet: isPartOfDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
