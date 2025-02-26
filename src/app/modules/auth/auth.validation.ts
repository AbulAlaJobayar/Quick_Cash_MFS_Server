import { z } from 'zod';

const loginValidationSchema = z.object({
  mobileNumber: z
    .string()
    .min(11, { message: 'mobile Number must be 11 digits' }),
  pin: z.string(),
});

const changePasswordSchema = z.object({
  oldPin: z.string({ message: 'please provide Old pin' }),
  newPin: z.string({ message: 'please provide Old pin' }),
});

export type TLoginSchema = z.infer<typeof loginValidationSchema>;
export const AuthValidation = {
  loginValidationSchema,
  changePasswordSchema,
};
