import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../src/app'
import { beforeEach } from 'node:test'
import { execSync } from 'child_process'

describe('Users routes', () => {
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

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
      })
      .expect(201)
  })
})
