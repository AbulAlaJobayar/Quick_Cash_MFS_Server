import { model, Schema } from 'mongoose';
import { IBalanceRequest } from './balanceRequest.interface';

const balanceRequestSchema = new Schema<IBalanceRequest>(
  {
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminId: { type: Schema.Types.ObjectId, ref: 'User',required:false },
    transactionId:{type:String, required:true}
  },
  { timestamps: true },
);

export const BalanceRequest = model<IBalanceRequest>(
  'BalanceRequest',
  balanceRequestSchema,
);
