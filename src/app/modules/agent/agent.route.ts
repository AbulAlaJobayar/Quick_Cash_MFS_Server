import { USER_ROLE } from './../../middleware/auth';
import { AgentSchemaValidation } from './agent.validation';
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AgentController } from './agent.controller';
import auth from '../../middleware/auth';

const router = Router();
router.post(
  '/create_agent',
  auth(USER_ROLE.user,USER_ROLE.admin),
  validateRequest(AgentSchemaValidation.createUserSchema),
  AgentController.createAgent,
);
router.get('/',auth(USER_ROLE.admin), AgentController.getAllAgentFromDB);
router.post(
  '/approved_agent',auth(USER_ROLE.admin),
  validateRequest(AgentSchemaValidation.validateUserSchema),
  AgentController.approvedAgent,
);
export const AgentRoute = router;
