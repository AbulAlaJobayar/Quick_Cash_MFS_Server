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
// auth(USER_ROLE.admin),
router.get('/', UserController.getUsersFromDB);
router.get('/:id',auth(USER_ROLE.admin,USER_ROLE.agent,USER_ROLE.user), UserController.getUserByIdFromDB);
router.put('/delete_user', UserController.bulkDeleteFromDB)

//todo: router.put('/:id', UserController.bulkDeleteFromDB)
export const userRoutes = router;
