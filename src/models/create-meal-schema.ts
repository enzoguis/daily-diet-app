import { z } from 'zod'

const stringToDate = z.preprocess((value) => {
  if (typeof value === 'string') {
    return new Date(value)
  }
  return value
}, z.date())

export const createMealSchema = z.object({
  name: z.string(),
  description: z.string(),
  isPartOfDiet: z.enum(['yes', 'no']),
  dateAndTime: stringToDate,
})
