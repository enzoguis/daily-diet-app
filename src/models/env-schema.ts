import { z } from 'zod'
import { config } from 'dotenv'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: true })
} else {
  config({ override: true })
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string(),
  DATABASE_CLIENT: z.string(),
  PORT: z.coerce.number().default(3000),
})

const envParse = envSchema.safeParse(process.env)

if (!envParse.success) {
  console.error('Invalid environment variables:', envParse.error.format())
  throw new Error('Invalid environment variables')
}

export const env = envParse.data
