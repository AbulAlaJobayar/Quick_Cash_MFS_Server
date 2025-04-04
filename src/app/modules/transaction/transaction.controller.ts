import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { TransactionServices } from './transaction.service';

const sendMoney = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await TransactionServices.sendMoney(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Money sent successfully',
    data: result,
  });
});
const cashIn = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await TransactionServices.cashIn(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Money sent successfully',
    data: result,
  });
});
const cashOut = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await TransactionServices.cashOut(id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Cash Out successfully',
    data: result,
  });
});
const getTotalTransactionByMe = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user;
    const result = await TransactionServices.getTransactionByMe(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction Retrieved successfully',
      data: result,
    });
  },
);
const getTransactionFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionServices.getTransactionFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Transaction Retrieved successfully',
    data: result,
  });
});
const getTodaysTransaction = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;
  const result = await TransactionServices.getTodaysTransaction(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Today Transaction Retrieved successfully',
    data: result,
  });
});
const getMonthlyTransactionData = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.user;
    console.log(id)
    const result = await TransactionServices.getMonthlyTransactions(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Monthly Transaction Retrieved successfully',
      data: result,
    });
  },
);
const getTransactionById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id)
    const result = await TransactionServices.getTransactionById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Transaction Retrieved successfully',
      data: result,
    });
  },
);

export const TransactionController = {
  sendMoney,
  cashIn,
  cashOut,
  getTotalTransactionByMe,
  getTransactionFromDB,
  getTodaysTransaction,
  getMonthlyTransactionData,
  getTransactionById
};
