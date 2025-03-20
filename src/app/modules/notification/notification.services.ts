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

const getUnreadNotificationCount = async (userId: string) => {
  // Find the user
  const user = await User.findById({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }

  // Count the number of unread notifications for the user

  const unreadNotifications = await Notification.find({
    userId: userId,
    isRead: false,
  }).sort({
    createdAt: -1,
  });

  return unreadNotifications;
};

const markAsRead = async (userId: string, notificationId: string) => {
  console.log(userId, notificationId);
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true },
  ).populate('userId');

  if (!notification) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notification Not Found');
  }

  // Fetch transaction if transactionId exists
  let transaction = null;
  if (notification.transactionId) {
    transaction = await Transaction.findOne({
      transactionId: notification.transactionId,
    });
  }

  return { notification, transaction }; // Return the updated notification
};
const getNotificationDetailsById = async (id: string) => {
  const result = await Notification.findById(id).populate('userId').exec();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
  }

  // Fetch the associated transaction
  const transaction = await Transaction.findOne({
    transactionId: result.transactionId,
  }).exec();

  if (!transaction) {
    throw new AppError(httpStatus.NOT_FOUND, 'Transaction not found');
  }

  // Return a combined object
  return {
    notification: result,
    transaction,
  };
};

export const NotificationService = {
  getNotificationById,
  getUnreadNotificationCount,
  markAsRead,
  getNotificationDetailsById,
};
