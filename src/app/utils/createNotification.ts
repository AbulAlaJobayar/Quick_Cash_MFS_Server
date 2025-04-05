import { Notification } from '../modules/notification/notification.model';

const createNotification = async (
  userId: string,
  transactionId: string,
  message: string,
  amount: number,
  fee: number,
) => {
  try {
    const payload = {
      userId: userId,
      amount: amount,
      fee: fee,
      transactionId: transactionId,
      message: message,
    };
    const notification = await Notification.create(payload);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw new Error('Error creating notification');
  }
};
export default createNotification;
