import { Router } from 'express';
import auth, { USER_ROLE } from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { transactionValidationSchema } from './transaction.validation';
import { TransactionController } from './transaction.controller';

const router = Router();

router.get(
  '/all_transaction',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  TransactionController.getTransactionFromDB,
);
router.get(
  '/my_transaction',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  TransactionController.getTotalTransactionByMe,
);
router.get(
  '/today_transaction',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  TransactionController.getTodaysTransaction,
);
router.get(
  '/monthly',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  TransactionController.getMonthlyTransactionData,
);

router.post(
  '/send_money',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  validateRequest(transactionValidationSchema.transactionSchema),
  TransactionController.sendMoney,
);
router.post(
  '/cash_in',
  auth(USER_ROLE.admin, USER_ROLE.agent),
  validateRequest(transactionValidationSchema.transactionSchema),
  TransactionController.cashIn,
);
router.post(
  '/cash_out',
  auth(USER_ROLE.user),
  validateRequest(transactionValidationSchema.transactionSchema),
  TransactionController.cashOut,
);



export const TransactionRoute = router;
