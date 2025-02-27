import { Notification } from '../modules/notification/notification.model';

const createNotification = async (userId: string, message: string) => {
  const payload = {
    userId:userId,
    message:message,
  };
  const notification = await Notification.create(payload);
  return notification;
};
export default createNotification;
