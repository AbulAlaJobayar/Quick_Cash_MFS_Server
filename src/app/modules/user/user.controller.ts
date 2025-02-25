import status from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { userService } from './user.service';
import sendResponse from '../../utils/sendResponse';

const createUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { result, accessToken } = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'User created successfully',
    data: { result, accessToken },
  });
});
const getUsersFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getUsersFromDB();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Retrieved successfully',
    data: result,
  });
});
const getUserByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getUserByIdFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Retrieved successfully',
    data: result,
  });
});
const bulkDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.body
 
  const result=await userService.bulkDeleteFromDB(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Deleted successfully',
    data: result,
  });
});
const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const {id}=req.params
 
  const result=await userService.updateUserById(req.body,id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User Updated successfully',
    data: result,
  });
});

export const UserController = {
  createUserIntoDB,
  getUsersFromDB,
  getUserByIdFromDB,
  bulkDeleteFromDB,
  updateUserById
};
