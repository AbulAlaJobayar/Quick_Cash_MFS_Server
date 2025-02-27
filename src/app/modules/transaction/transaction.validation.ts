import { z } from 'zod';
const transactionSchema = z.object({
  mobileNumber: z.string({
    message: 'Must be provide recipient Mobile number',
  }),
  amount: z.number().positive('Amount must be a positive number'),
  pin: z.string({ message: 'must be provide your valid pin' })
});


export type TTransaction = z.infer<typeof transactionSchema>;

export const transactionValidationSchema = {
  transactionSchema,
};
