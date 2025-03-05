import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { mealsRoutes } from './routes/meals'
import { metricsRoutes } from './routes/metrics'

export const app = fastify()

app.register(metricsRoutes)
app.register(mealsRoutes)
app.register(usersRoutes, {
  prefix: '/users',
})
