import { Types } from "mongoose";

export interface INotification {
    userId: Types.ObjectId; 
    message: string; 
    isRead: boolean; 
  }