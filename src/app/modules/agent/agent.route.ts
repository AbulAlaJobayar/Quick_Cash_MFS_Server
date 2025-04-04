import { USER_ROLE } from './../../middleware/auth';
import { AgentSchemaValidation } from './agent.validation';
import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AgentController } from './agent.controller';
import auth from '../../middleware/auth';

const router = Router();
router.post(
  '/create_agent',
  auth(USER_ROLE.user),
  validateRequest(AgentSchemaValidation.createUserSchema),
  AgentController.createAgent,
);
router.get(
  '/all_agent',
  auth(USER_ROLE.admin),
  AgentController.getAllAgentFromDB,
);
router.put(
  '/approved_agent',
  auth(USER_ROLE.admin),
  validateRequest(AgentSchemaValidation.validateUserSchema),
  AgentController.approvedAgent,
);
export const AgentRoute = router;
