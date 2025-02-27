import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { BalanceRequest } from './balanceRequest.model';
import mongoose from 'mongoose';
import createNotification from '../../utils/createNotification';
import generateTransactionId from '../../utils/generateTransactionId';

const balanceFromAgent = async (
  id: string,
  payload: { amount: number; adminId?: string },
) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
  }
  if (user.accountType !== 'agent') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is not an agent');
  }
  const data = {
    agentId: user._id,
    amount: payload.amount,
  };
  const result = await BalanceRequest.create(data);
  if (!result) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create balance request',
    );
  }
  return result;
};

const approvedBalanceRequest = async (adminId: string, id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('request fail')
    const request = await BalanceRequest.findById({_id:id}).session(session);
    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, 'Request Money Not Found');
    }
    console.log("request passs")

    if (request.status === 'approved') {
      throw new AppError(
        httpStatus.ALREADY_REPORTED,
        'Request Money Already Approved',
      );
    }

    const admin = await User.findById({ _id: adminId }).session(session);
    if (!admin || admin.accountType !== 'admin') {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid admin ID');
    }

    // Step 4: Update the balance request status and adminId
    const updatedRequest = await BalanceRequest.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        adminId: adminId,
      },
      { new: true, session }, // Return the updated document and use the session
    );

    if (!updatedRequest) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update balance request',
      );
    }

    const user = await User.findById({ _id: updatedRequest.agentId }).session(
      session,
    );
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    user.balance += updatedRequest.amount; // Add the requested amount to the user's balance
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    //send agent
    const transactionId = generateTransactionId();
    await createNotification(
      user._id.toString(),
      transactionId,
      `Your request is approved your requested Money is ${request.amount} to add your balance`,
    );
    // send admin
    await createNotification(
      adminId.toString(),
      transactionId,
      `You approved ${user.name} request `,
    );

    return updatedRequest;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
export const balanceRequestService = {
  balanceFromAgent,
  approvedBalanceRequest,
};
