import { z } from 'zod'
import { config } from 'dotenv'

// if (process.env.NODE_ENV === 'test') {
//   config({ path: '.env.test' })
// } else {
//   config()
// }

const envSchema = z.object({
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.coerce.number().default(3000),
})

const envParse = envSchema.safeParse(process.env)

if (envParse.success === false) {
  throw new Error(`Invalid environment variables: ${envParse.error}`)
}

export const env = envParse.data
