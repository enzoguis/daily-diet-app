import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Metrics routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user metrics', async () => {
    const createUserBody = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const userId = createUserBody.body.id

    await request(app.server)
      .post(`/user/${userId}/meal`)
      .send({
        name: 'refeição teste',
        description: 'uma refeição de teste',
        dateAndTime: '2022-12-31T12:00:00.000Z',
        isPartOfDiet: 'yes',
      })
      .expect(201)

    await request(app.server)
      .post(`/user/${userId}/meal`)
      .send({
        name: 'refeição 2',
        description: 'uma refeição de teste 2',
        dateAndTime: '2023-12-31T12:00:00.000Z',
        isPartOfDiet: 'no',
      })
      .expect(201)

    const metricsBody = await request(app.server)
      .get(`/user/${userId}/metrics`)
      .expect(200)

    expect(metricsBody.body).toEqual(
      expect.objectContaining({
        totalMeals: 2,
        isPartOfDietMeals: 1,
        isNotPartOfDietMeals: 1,
      })
    )
  })
})
