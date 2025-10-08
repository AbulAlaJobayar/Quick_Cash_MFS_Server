import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { OfferService } from './offer.services';
import sendResponse from '../../utils/sendResponse';

/**
 * Create a new offer in the database
 */
const createOffer = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.createOffer(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Offer Created successfully',
    data: result,
  });
});
/**
 * Get all active offers from the database
 */

const getAllOffers = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferService.getAllOffers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offers retrieved successfully',
    data: result,
  });
});
const getOfferById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferService.getOfferById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offers retrieved successfully',
    data: result,
  });
});
const deleteOfferById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferService.deleteOfferById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer deleted successfully',
    data: result,
  });
});
export const OfferController = {
  createOffer,
  getAllOffers,
  getOfferById,
  deleteOfferById,
};
