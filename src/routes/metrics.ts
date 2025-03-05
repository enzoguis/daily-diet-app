import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { Params } from '../@types/params'

export async function metricsRoutes(app: FastifyInstance) {
  app.get<{ Params: Params }>('/user/:id/metrics', async (request) => {
    const { id } = request.params
    const totalMeals = await knex('meals')
      .where({ user_id: id })
      .orderBy('date_and_time', 'desc')

    const isPartOfDietMeals = await knex('meals')
      .where({
        user_id: id,
        is_part_of_diet: 'yes',
      })
      .count('id', { as: 'total' })
      .first()

    const isNotPartOfDietMeals = await knex('meals')
      .where({ user_id: id, is_part_of_diet: 'no' })
      .count('id', { as: 'total' })
      .first()

    return {
      totalMeals: totalMeals.length,
      isPartOfDietMeals: isPartOfDietMeals!.total,
      isNotPartOfDietMeals: isNotPartOfDietMeals!.total,
    }
  })
}
