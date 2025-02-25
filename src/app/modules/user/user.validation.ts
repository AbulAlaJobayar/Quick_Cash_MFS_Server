import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  pin: z.string(),
  mobileNumber: z
    .string()
    .length(11, { message: 'Mobile number must be exactly 11 digits long' }),
  email: z.string().email({ message: 'Invalid email format' }),
  nid: z
    .string()
    .min(10, { message: 'NID must be at least 10 characters long' }),
});

export const UserValidation = {
  createUserSchema,
};
