import { model, Schema } from 'mongoose';
import { IUser } from './user.interface';
import bcrypt from "bcrypt";
import config from '../../config';

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please input your name'],
    },
    email: {
      type: String,
      required: [true, 'Please input your email'],
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    pin: {
      type: String,
      required: [true, 'Please input your PIN '],
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ['user', 'agent', 'admin'],
      default: 'user',
    },
    nid: {
      type: String,
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 40, // Ensure initial balance is set
    },
    status: {
      type: String,
      enum: ['blocked', 'approved'],
      default: 'approved',
      required: true,
    },
    sessionId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Hash PIN before saving a new user
userSchema.pre('save', async function (next) {
  const user = this; // doc
  // console.log('Original PIN:', user.pin); // Debug log
  // console.log('Salt Rounds:', config.bcrypt_salt_rounds); // Debug log

  if (user.isModified('pin')) {
    user.pin = await bcrypt.hash(
      user.pin.trim(), // Trim whitespace
      Number(config.bcrypt_salt_rounds),
    );
    // console.log('Hashed PIN:', user.pin); // Debug log
  }
  next();
});


export const User = model<IUser>('User', userSchema);
