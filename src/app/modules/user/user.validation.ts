import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  pin: z.string(),
  mobileNumber: z
    .string()
    .min(10, { message: 'Please enter min 10 digit number' })
    .max(15, { message: 'Mobile number must be exactly 15 digits long' }),
  email: z.string().email({ message: 'Invalid email format' }),
  nid: z
    .string()
    .min(10, { message: 'NID must be at least 10 characters long' }),
});

export const UserValidation = {
  createUserSchema,
};
