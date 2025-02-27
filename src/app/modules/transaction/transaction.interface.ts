import { Types } from 'mongoose';

export interface ITransaction {
  senderId: Types.ObjectId;
  recipientId: Types.ObjectId;
  adminId: Types.ObjectId;
  amount: number;
  fee:number;
  type:'sendMoney'| 'cashIn'| 'cashOut';
  transactionId:string;
}
