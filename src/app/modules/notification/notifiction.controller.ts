import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';
import { NotificationService } from './notification.services';

const getTransactionFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await NotificationService.getNotificationById(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification Retrieved successfully',
    data: result,
  });
});
const getUnreadNotificationCount = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user;
    const result = await NotificationService.getUnreadNotificationCount(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Unread Notification Retrieved successfully',
      data: result,
    });
  },
);
const markAsRead = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const { id } = req.body;
  const result = await NotificationService.markAsRead(userId, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: ' Notification read successfully',
    data: result,
  });
});

export const NotificationController = {
  getTransactionFromDB,
  getUnreadNotificationCount,
  markAsRead
};
