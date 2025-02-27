import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Notification } from './notification.model';
import { User } from '../user/user.model';
import { Transaction } from '../transaction/transaction.model';

const getNotificationById = async (userId: string) => {
  const user = await User.findById({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  const notification = await Notification.find({ userId: user._id }).sort({
    createdAt: -1,
  });
  if (!notification) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notification Not Found'); // if notification not found for the user, throw an error. If notification exists, return it.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists, throw an error.  // If no notification exists,
  }
  return notification;
};

const getUnreadNotificationCount = async (userId: string): Promise<number> => {
  // Find the user
  const user = await User.findById({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Count the number of unread notifications for the user
  const unreadNotificationCount = await Notification.countDocuments({
    userId: user._id,
    isRead: false,
  });

  return unreadNotificationCount; // Return the count of unread notifications
};

const markAsRead = async (userId: string, notificationId: string) => {
  // Find the user
  const user = await User.findById({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Find and update the notification
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true },
  ).populate('userId');

  if (!notification) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notification Not Found');
  }
  const transaction = await Transaction.findOne({
    transactionId: notification.transactionId,
  })

  return { notification, transaction }; // Return the updated notification
};

export const NotificationService = {
  getNotificationById,
  getUnreadNotificationCount,
  markAsRead,
};
