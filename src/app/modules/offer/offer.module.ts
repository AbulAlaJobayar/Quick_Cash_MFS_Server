import { model, Schema } from 'mongoose';
import { IOffer } from './offer.interface';

const offerSchema = new Schema<IOffer>(
  {
    title: String,
    description: String,
    imageUrl: String,
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true },
);
export const Offer = model<IOffer>('Offer', offerSchema);
