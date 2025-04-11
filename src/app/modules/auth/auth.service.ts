import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginSchema } from './auth.validation';
import bcrypt from 'bcryptjs';
import { createToken, TJwtPayload, verifyToken } from '../../utils/tokenUtils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { sendEmail, sendPasswordResetEmail } from '../../utils/sendEmail';
import comparPassword from '../../utils/comparPassword';
import { v4 as uuidv4 } from 'uuid';

//login
const userLogin = async (payload: TLoginSchema) => {
  const user = await User.findOne({
    mobileNumber: payload.mobileNumber,
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found ');
  }
  let isLoggedIn = false;
  if (user.sessionId) {
    isLoggedIn = true;
  }
  const isPinMatched = comparPassword(payload.pin, user.pin);
  // console.log({ isPasswordMatched }); // Debug log

  if (!isPinMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your password is incorrect');
  }

  const sessionId = uuidv4(); // Generate a unique session ID

  const tokenData: TJwtPayload = {
    id: user._id,
    mobileNumber: user.mobileNumber,
    sessionId,
    role: user.accountType,
  };

  const accessToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  user.sessionId = sessionId;
  user.save();
  const refreshToken = createToken(
    tokenData,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );
  return {
    accessToken,
    refreshToken,
    isLoggedIn,
  };
};

//change password
const changePassword = async (
  userData: JwtPayload,
  payload: { newPin: string; oldPin: string },
) => {
  const user = await User.findOne({ _id: userData.id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found ');
  }
  const isPasswordMatched = comparPassword(payload.oldPin, user.pin);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }
  //hash new password

  const newHashedPassword = await bcrypt.hash(
    payload.newPin.trim(), // Trim whitespace
    Number(config.bcrypt_salt_rounds),
  );

  await User.findByIdAndUpdate(
    {
      _id: userData.id,
      mobileNumber: userData.MobileNumber,
    },
    {
      pin: newHashedPassword,
    },
    { new: true },
  );
  return null;
};

//refreshToken
const refreshToken = async (token: string) => {
  const decoded = verifyToken(token, config.jwt_refresh_secret);
  if (!decoded) {
    throw new AppError(httpStatus.FORBIDDEN, 'Invalid or expired token');
  }
  const { id } = decoded;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found ');
  }

  const tokenData: TJwtPayload = {
    id: user._id,
    mobileNumber: user.mobileNumber,
    sessionId: user.sessionId,
    role: user.accountType,
  };

  const accessToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  return accessToken;
};

//forgat password
const forgatPassword = async (payload:{email:string}) => {
  const user = await User.findOne({email:payload.email});
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found ');
  }

  const tokenData: TJwtPayload = {
    id: user._id,
    sessionId: user.sessionId,
    mobileNumber: user.mobileNumber,
    role: user.accountType,
  };

  const resetToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_reset_expire_in,
  );
  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token=${resetToken}`;
  sendPasswordResetEmail(user.email, {
    name: user.name || 'User',
    resetLink: resetUILink,
    expiryTime: config.resetExpiresIn,
  })
  
  console.log(resetUILink);
  return null
};
const resetPassword = async (
  payload: { id: string; newPin: string },
  token: string,
) => {
  console.log(payload)
  const user = await User.findById({ _id: payload.id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found ');
  }

  const decoded = verifyToken(token, config.jwt_access_secret);
  if (payload.id !== decoded.id) {
    console.log(payload.id, decoded.id);
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  const newHashedPin = await bcrypt.hash(
    payload.newPin.trim(),
    Number(config.bcrypt_salt_rounds),
  );

  await User.findByIdAndUpdate(
    { _id: user._id },
    {
      pin: newHashedPin,
    },
  );
  return null;
};


//remove from all device
const removeFromAllDevice = async (id: string) => {
  const user = await User.findOneAndUpdate({ _id: id }, { sessionId: '' });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  return null;
};
const LogOutFromDevice = async (id: string) => {
  const user = await User.findByIdAndUpdate({ _id: id }, { sessionId: '' });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  return null;
};

export const AuthServices = {
  userLogin,
  changePassword,
  refreshToken,
  forgatPassword,
  resetPassword,
  removeFromAllDevice,
  LogOutFromDevice,
};
