import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';
import config from '../../config';
import AppError from '../../errors/AppError';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { accessToken, refreshToken,isLoggedIn } = await AuthServices.userLogin(req.body);
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 365,
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successfully',
    data: {accessToken,isLoggedIn},
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  await AuthServices.changePassword(req.user, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password Change successfully',
    data: null,
  });
});
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  const result = await AuthServices.forgatPassword(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      'Reset link is generated successfully please open your Email Account!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong !');
  }

  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully!',
    data: result,
  });
});
const removeFromAllDevice = catchAsync(async (req, res) => {
  const { id } = req.body;
  const result = await AuthServices.removeFromAllDevice(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'You are Logout From All Devices',
    data: result,
  });
});
const  LogOutFromDevice  = catchAsync(async (req, res) => {
  const {id}=req.user
  const result = await AuthServices.LogOutFromDevice(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'You are Logout ',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
  removeFromAllDevice,
  LogOutFromDevice 
};
