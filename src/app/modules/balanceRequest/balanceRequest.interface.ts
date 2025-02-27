import { Types } from "mongoose";

export interface IBalanceRequest {
    agentId: Types.ObjectId;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    adminId?:Types.ObjectId
  }