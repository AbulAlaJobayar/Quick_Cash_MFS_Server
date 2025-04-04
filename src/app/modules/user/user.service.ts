import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }

  const result = await User.findById({ _id: user._id }).select('-pin');
  return result;
};

//get all users from db
const getUsersFromDB = async () => {
  const users = await User.find({}).select('-pin');
  if (!users) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to fetch users');
  }

  return users;
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

const bulkDeleteFromDB = async (payload:{id:string; status:"approved"|"blocked"}) => {
  const result = await User.findByIdAndUpdate(
    { _id: payload.id },
    { status: payload.status},
    { new: true },
  ).select('-pin');
  return result;
};
const updateUserById = async (payload: Partial<IUser>, id: string) => {
  console.log('user id', id);
  const user = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  }).select('-pin');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  return user;
};
const getMe = async (id: string) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }
  return user;
};
export const userService = {
  createUserIntoDB,
  getUsersFromDB,
  getUserByIdFromDB,
  bulkDeleteFromDB,
  updateUserById,
  getMe,
};
