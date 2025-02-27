import { Router } from 'express';
import auth, { USER_ROLE } from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { balanceRequestValidation } from './balanceRequest.validation';
import { balanceRequestController } from './balanceRequest.controller';

const router = Router();

router.post(
  '/create_request',
  auth(USER_ROLE.agent),
  validateRequest(balanceRequestValidation.createBalanceRequestValidation),
  balanceRequestController.createBalanceRequest,
);
router.put('/approved_request',auth(USER_ROLE.admin),balanceRequestController.approvedBalanceRequest)

export const balanceRequestRouter = router;
