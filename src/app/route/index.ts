import { Router } from 'express';
import { userRoutes } from '../modules/user/user.route';
import { AuthRoutes } from '../modules/auth/auth.route';
import { AgentRoute } from '../modules/agent/agent.route';
import { TransactionRoute } from '../modules/transaction/transaction.route';
import { NotificationRoute } from '../modules/notification/notification.route';
import { balanceRequestRouter } from '../modules/balanceRequest/balanceRequest.route';
import { OfferRouter } from '../modules/offer/offer.route';

const router = Router();
const moduleRoute = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/agent',
    route: AgentRoute,
  },
  {
    path: '/transaction',
    route: TransactionRoute,
  },
  {
    path: '/notification',
    route: NotificationRoute,
  },
  {
    path: '/balanceRequest',
    route: balanceRequestRouter,
  },
  {
    path: '/offer',
    route: OfferRouter,
  },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
