import { Router } from 'express';
import auth, { USER_ROLE } from '../../middleware/auth';
import { NotificationController } from './notifiction.controller';

const router = Router();

router.get(
  '/all_notification',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  NotificationController.getTransactionFromDB,
);
router.get(
  '/unread',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  NotificationController.getUnreadNotificationCount,
);

router.put(
  '/mark_read',
  auth(USER_ROLE.admin, USER_ROLE.agent, USER_ROLE.user),
  NotificationController.markAsRead
);


export const NotificationRoute = router;
