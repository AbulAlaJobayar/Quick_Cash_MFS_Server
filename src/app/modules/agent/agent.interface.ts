import { Types } from "mongoose";

export interface IAgent{
    userId:Types.ObjectId;
    storeName:string;
    storeLocation:string;
    amount:number;
    status:"in-progress"|"approved"
}