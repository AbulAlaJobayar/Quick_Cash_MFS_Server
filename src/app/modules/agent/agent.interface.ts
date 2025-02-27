import { Types } from "mongoose";

export interface IAgent{
    userId:Types.ObjectId;
    storeName:string;
    storeLocation:string;
    status:"in-progress"|"approved"
}