import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { createToken, TJwtPayload } from '../../utils/tokenUtils';
import { IUser } from './user.interface';
import { User } from './user.model';
import { v4 as uuidv4 } from 'uuid';

//createUserIntoDB
const createUserIntoDB = async (payload: IUser) => {

 // Update sessionId after user creation
  const sessionId = uuidv4();
  payload.sessionId = sessionId;
    // Create user
  const user = await User.create(payload);
  console.log(user);
  if (!user) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create user',
    );
  }
  // Create JWT Token
  const tokenData: TJwtPayload = {
    id: user._id,
    sessionId,
    mobileNumber: user.mobileNumber,
    role: user.accountType,
  };

  const accessToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  const result = await User.findById({ _id: user._id }).select('-pin');
  return { result, accessToken };
};

//get all users from db
const getUsersFromDB = async () => {
  const result = await User.aggregate([
    { $match: { status: 'approved' } },
    { $project: { pin: 0 } },
  ]);
  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to fetch users',
    );
  }
  return result;
};

//get user by id
const getUserByIdFromDB = async (id: string) => {
  const user = await User.findById(id).select('-pin');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  return user;
};

const bulkDeleteFromDB = async (id: string) => {
  console.log('services id', id);
  const result = await User.findByIdAndUpdate(
    { _id: id },
    { status: 'blocked' },
    { new: true },
  ).select('-pin');
  return result;
};
const updateUserById = async (payload: Partial<IUser>, id: string) => {
  const user = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  }).select('-pin');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  return user;
};
export const userService = {
  createUserIntoDB,
  getUsersFromDB,
  getUserByIdFromDB,
  bulkDeleteFromDB,
  updateUserById,
};
