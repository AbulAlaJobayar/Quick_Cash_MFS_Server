import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { balanceRequestService } from './balanceRequest.services';

const createBalanceRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await balanceRequestService.balanceFromAgent(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Balance request  successfully send wait for admin response',
    data: result,
  });
});

const approvedBalanceRequest = catchAsync(async (req: Request, res: Response) => {
  const { id:adminId} = req.user;
  const {id:requestId}=req.body

  const result = await balanceRequestService.approvedBalanceRequest(adminId, requestId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Balance Update successfully',
    data: result,
  });
});

export const balanceRequestController = {
  createBalanceRequest,
  approvedBalanceRequest
};
