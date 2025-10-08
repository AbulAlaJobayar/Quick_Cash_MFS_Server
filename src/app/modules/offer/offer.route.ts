import { Router } from 'express';
import auth, { USER_ROLE } from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { OfferValidation } from './offer.validation';
import { OfferController } from './offer.controller';

const router = Router();
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(OfferValidation.createOfferZodSchema),
  OfferController.createOffer,
);
router.get('/', OfferController.getAllOffers);
router.get('/:id', OfferController.getOfferById);
router.delete('/:id', auth(USER_ROLE.admin), OfferController.deleteOfferById);

export const OfferRouter = router;
