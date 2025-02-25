import { Types } from "mongoose";

export interface IUser {
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  accountType: 'user' | 'agent' | 'admin';
  nid: string;
  balance: number;
  status: 'blocked' | 'approved';
  sessionId: string | null;
}


