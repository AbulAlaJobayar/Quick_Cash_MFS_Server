import { z } from 'zod';
import mongoose from 'mongoose';

const createUserSchema = z.object({
  userId: z.string(),
  storeName: z
    .string()
    .min(2, { message: 'Store name must be at least 2 characters long' }),
  storeLocation: z
    .string()
    .min(3, { message: 'Store location must be at least 3 characters long' }),
});
const validateUserSchema=z.object({
    id:z.string({message: "please provide User Id"})
})

export const AgentSchemaValidation = {
  createUserSchema,
  validateUserSchema
};
