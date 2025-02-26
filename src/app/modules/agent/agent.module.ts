import { model, Schema } from 'mongoose';
import { IAgent } from './agent.interface';

const AgentSchema = new Schema<IAgent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    }, 
    storeName: { type: String, required: true },
    storeLocation: { type: String, required: true },
    amount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['in-progress', 'approved'],
      default: 'in-progress',
    },
  },
  { timestamps: true },
);

export const Agent = model<IAgent>('Agent', AgentSchema);
