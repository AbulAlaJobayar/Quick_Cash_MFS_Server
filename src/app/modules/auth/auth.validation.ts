import { z } from 'zod';

const loginValidationSchema = z.object({
  mobileNumber: z
    .string()
    .min(11, { message: 'mobile Number must be 11 length' }),
  pin: z
    .string()
    .min(4, { message: 'pin must be 4 character' })
    .max(4, { message: 'pin must be Max 12 character' }),
});


const changePasswordSchema = z.object({
  oldPin: z.string({ message: 'please provide Old pin' }),
  newPin: z
    .string()
    .min(4, { message: 'New pin must be 4 character' })
    .max(4, { message: 'New pin must be Max 12 character' }),
});

export type TLoginSchema = z.infer<typeof loginValidationSchema>;
export const AuthValidation={
  loginValidationSchema,
  changePasswordSchema
}