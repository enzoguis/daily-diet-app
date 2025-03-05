import { app } from './app'
import 'dotenv/config'
import { env } from './models/env-schema'

app.listen({ port: env.PORT }, () => {
  console.log('Server running on port: ', env.PORT)
})
