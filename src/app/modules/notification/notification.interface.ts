import { Types } from "mongoose";

export interface INotification {
    userId: Types.ObjectId; 
    transactionId:string;
    message: string; 
    isRead: boolean; 
  }