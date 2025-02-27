import { z } from 'zod';

const createBalanceRequestValidation = z.object({
  amount: z.number({ message: 'balance must be Number' }).positive(),
});
export const balanceRequestValidation = {
  createBalanceRequestValidation,
};
