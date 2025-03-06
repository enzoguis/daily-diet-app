import { app } from './app'
import 'dotenv/config'
import { env } from './models/env-schema'

app.listen({ port: env.PORT, host: '0.0.0.0' }, () => {
  console.log('Server running on port: ', env.PORT)
})
