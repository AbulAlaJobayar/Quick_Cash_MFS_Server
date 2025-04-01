import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';
import auth, { USER_ROLE } from '../../middleware/auth';

const router = Router();

router.post(
  '/create_user',
  validateRequest(UserValidation.createUserSchema),
  UserController.createUserIntoDB,
);

router.get('/', auth(USER_ROLE.admin), UserController.getUsersFromDB);
router.get(
  '/user_profile',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  UserController.getMe,
);
router.get(
  'me/:id',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  UserController.getUserByIdFromDB,
);
router.put(
  '/user_update',
  auth(USER_ROLE.admin,USER_ROLE.agent,USER_ROLE.user),
  UserController.updateUserById,
);

//todo: router.put('/:id', UserController.bulkDeleteFromDB)
export const userRoutes = router;
