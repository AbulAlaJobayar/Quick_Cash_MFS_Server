import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IOffer } from './offer.interface';
import { Offer } from './offer.module';


/**
 * Create a new offer in the database
 */
const createOffer = async (payload: IOffer) => {
  const offer = await Offer.create(payload);

  if (!offer) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create offer');
  }

  return offer;
};

/**
 * Get all active offers from the database
 */
const getAllOffers = async () => {
  const offers = await Offer.find({ status: 'active' }).sort({ createdAt: -1 });

  // Returning empty array instead of throwing error is often better UX
  if (!offers.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No active offers found');
  }

  return offers;
};

/**
 * Get a single active offer by ID
 */
const getOfferById = async (id: string) => {
  const offer = await Offer.findOne({ _id: id, status: 'active' });

  if (!offer) {
    throw new AppError(httpStatus.NOT_FOUND, `Offer with ID ${id} not found`);
  }

  return offer;
};

/**
 * Delete a single offer by ID
 */
const deleteOfferById = async (id: string) => {
  const offer = await Offer.findByIdAndDelete(id);

  if (!offer) {
    throw new AppError(httpStatus.NOT_FOUND, `Offer with ID ${id} not found or already deleted`);
  }

  return offer;
};

export const OfferService = {
  createOffer,
  getAllOffers,
  getOfferById,
  deleteOfferById,
};
