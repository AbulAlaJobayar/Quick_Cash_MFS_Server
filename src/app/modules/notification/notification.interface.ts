import { Types } from "mongoose";

export interface INotification {
    userId: Types.ObjectId; 
    amount: number;
    fee: number;
    transactionId:string;
    message: string; 
    isRead: boolean; 
  }