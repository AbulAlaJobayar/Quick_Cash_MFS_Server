import { z } from 'zod';

const createOfferZodSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string(),
  imagUrl: z.string().url(),
  status: z.enum(['active', 'inactive']).optional(),
});
export const OfferValidation = {
  createOfferZodSchema,
};
