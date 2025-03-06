import request from 'supertest'
import { afterAll, beforeAll, describe, beforeEach, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'

describe('Meals routes', () => {
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

  it('should be able to create a new meal', async () => {
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
  })
  it('should be able to list all meals for a user', async () => {
    const createUserBody = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const userId = createUserBody.body.id

    await request(app.server).get(`/user/${userId}/meals`).expect(200)
  })
  it('should be able to get a specific meal by ID', async () => {
    const createUserBody = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const userId = createUserBody.body.id

    const createMealResponse = await request(app.server)
      .post(`/user/${userId}/meal`)
      .send({
        name: 'refeição teste',
        description: 'uma refeição de teste',
        dateAndTime: '2022-12-31T12:00:00.000Z',
        isPartOfDiet: 'yes',
      })
      .expect(201)

    const mealId = createMealResponse.body.id

    await request(app.server).get(`/meal/${mealId}`).expect(200)
  })
  it('should be able to update a meal', async () => {
    const createUserBody = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const userId = createUserBody.body.id
    const createMealResponse = await request(app.server)
      .post(`/user/${userId}/meal`)
      .send({
        name: 'refeição teste',
        description: 'uma refeição de teste',
        dateAndTime: '2022-12-31T12:00:00.000Z',
        isPartOfDiet: 'yes',
      })
      .expect(201)

    const mealId = createMealResponse.body.id

    await request(app.server)
      .put(`/meal/${mealId}`)
      .send({
        name: 'refeição teste alterada',
        description: 'uma refeição de teste alterada',
        dateAndTime: '2023-01-01T12:00:00.000Z',
        isPartOfDiet: 'no',
      })
      .expect(200)
  })
  it('should be able to delete a meal', async () => {
    const createUserBody = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)

    const userId = createUserBody.body.id

    const createMealResponse = await request(app.server)
      .post(`/user/${userId}/meal`)
      .send({
        name: 'refeição teste',
        description: 'uma refeição de teste',
        dateAndTime: '2022-12-31T12:00:00.000Z',
        isPartOfDiet: 'yes',
      })
      .expect(201)

    const mealId = createMealResponse.body.id

    await request(app.server).delete(`/meal/${mealId}`).expect(204)
  })
})
