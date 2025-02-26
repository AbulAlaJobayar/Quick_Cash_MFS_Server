import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginSchema } from './auth.validation';
import bcrypt from 'bcryptjs';
import { createToken, TJwtPayload, verifyToken } from '../../utils/tokenUtils';
import config from '../../config';
import { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendEmail';
import comparPassword from '../../utils/comparPassword';

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
  if (user.sessionId) {
    throw new AppError(
      httpStatus.CONFLICT,
      'You are already login on other Device please Logout All Device',
    );
  }
  const isPinMatched = comparPassword(payload.pin, user.pin);
  // console.log({ isPasswordMatched }); // Debug log

  if (!isPinMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  console.log({ isPinMatched });

  const tokenData: TJwtPayload = {
    id: user._id,
    email: user.email,
    mobileNumber: user.mobileNumber,
    nid: user.nid,
    role: user.accountType,
  };

  const accessToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  user.sessionId = accessToken;
  user.save();
  const refreshToken = createToken(
    tokenData,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in,
  );
  return {
    accessToken,
    refreshToken,
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
    email: user.email,
    mobileNumber: user.mobileNumber,
    nid: user.nid,
    role: user.accountType,
  };

  const accessToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_access_expires_in,
  );
  user.sessionId = accessToken;
  user.save();
  return accessToken;
};

//forgat password
const forgatPassword = async (id: string) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found ');
  }

  const tokenData: TJwtPayload = {
    id: user._id,
    email: user.email,
    mobileNumber: user.mobileNumber,
    nid: user.nid,
    role: user.accountType,
  };

  const resetToken = createToken(
    tokenData,
    config.jwt_access_secret,
    config.jwt_reset_expire_in,
  );
  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  const resetUILink = `${config.reset_pass_ui_link}?id=${user._id}&token${resetToken}`;
  
  sendEmail(
    user.email,
    `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the button below to reset it:</p>
    <p>
      <a href="${ resetUILink }" class="button">Reset Password</a>
    </p>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link will expire in <strong>10 minutes</strong>.</p>
    <div class="footer">
      <p>Best regards,</p>
      <p>Quick Cash Team</p>
    </div>
  </div>
</body>
</html>
    
    `,
  );
  console.log(resetUILink);
};
const resetPassword = async (
  payload: { id: string; newPin: string },
  token: string,
) => {
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
};
//remove from all device
const removeFromAllDevice = async (payload:{mobileNumber:string,pin:string}) => {
  const user = await User.findOneAndUpdate({mobileNumber:payload.mobileNumber}, { sessionId: '' });
  
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not Found');
  }
  console.log(payload.pin,user.pin)
  const isPasswordMatched=comparPassword(payload.pin, user.pin);
  console.log(isPasswordMatched)
  if(!isPasswordMatched){
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }
  return null;
};
const LogOutFromDevice = async (id:string) => {
  const user = await User.findByIdAndUpdate({_id:id}, { sessionId: '' });
  
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
  LogOutFromDevice 
};
