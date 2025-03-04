import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AuthControllers } from './auth.controler';
import { AuthValidation } from './auth.validation';
import auth, { USER_ROLE } from '../../middleware/auth';
const router = Router();
router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
);

router.post(
  '/change-password',
  auth(USER_ROLE.user, USER_ROLE.agent, USER_ROLE.admin),
  validateRequest(AuthValidation.changePasswordSchema),
  AuthControllers.changePassword,
);

router.post('/refresh-token', AuthControllers.refreshToken);

router.post('/forget-password', AuthControllers.forgetPassword);

router.post('/reset-password', AuthControllers.resetPassword);
router.put('/remove_all_devices', AuthControllers.removeFromAllDevice);
router.post(
  '/logout',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  AuthControllers.LogOutFromDevice,
);

export const AuthRoutes = router;
