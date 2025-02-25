import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { UserValidation } from './user.validation';

const router = Router();

router.post(
  '/create_user',
  validateRequest(UserValidation.createUserSchema),
  UserController.createUserIntoDB,
);
router.get('/', UserController.getUsersFromDB);
router.get('/:id', UserController.getUserByIdFromDB);
router.post('/delete_user', UserController.bulkDeleteFromDB)
router.put('/:id', UserController.bulkDeleteFromDB)
export const userRoutes = router;
