import { model, Schema, Types } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: String ,required: true },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = model<INotification>(
  'Notification',
  notificationSchema,
);
