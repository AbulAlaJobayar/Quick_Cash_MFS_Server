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
  const admin = await User.findOne({ accountType:'admin' });

  if (!admin) {
    throw new AppError(httpStatus.NOT_FOUND, 'Admin Not Found');
  }
  const transactionId = generateTransactionId();
  const data = {
    agentId: user._id,
    amount: payload.amount,
    transactionId,
  };
  const result = await BalanceRequest.create(data);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create balance request',
    );
  }

  // Notify the sender
  await createNotification(
    user._id.toString(),
    transactionId,
    `You Requested ${result.amount} taka. please wait for admin Approved`,
  );

  // Notify the admin
  await createNotification(
    admin._id.toString(),
    transactionId,
    `Transaction ID: ${transactionId} - ${user.mobileNumber} Request balance ${result.amount} Taka. waiting for your Approval`,
  );
  return result;
};

const approvedBalanceRequest = async (adminId: string, payload:{id:string,status:string}) => {
  const session = await mongoose.startSession();
  session.startTransaction();
const {id,status}=payload
  try {
    const request = await BalanceRequest.findById({ _id: id }).session(session);
    if (!request) {
      throw new AppError(httpStatus.NOT_FOUND, 'Request Money Not Found');
    }

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
        status,
        adminId: admin._id,
      },
      { new: true, session }, // Return the updated document and use the session
    );

    if (!updatedRequest) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
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
      `Your request is  ${updatedRequest?.status} your requested Money is ${request.amount} `,
    );
    // send admin
    await createNotification(
      adminId.toString(),
      transactionId,
      `You ${updatedRequest?.status} ${user?.name} request `,
    );

    return updatedRequest;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getMyBalanceRequestFromDB=async(userId:string)=>{
 // Validate input
 if (!userId || typeof userId !== 'string') {
  throw new AppError(httpStatus.BAD_REQUEST, 'Invalid user ID');
}

// Find user with proper error handling
const user = await User.findById(userId).lean();
if (!user) {
  throw new AppError(httpStatus.NOT_FOUND, 'User not found');
}

// Fetch balance requests with projection for efficiency
const balanceRequests = await BalanceRequest.find({
  $or: [
    { agentId: user._id },
    { adminId: user._id },
  ]
}).populate("agentId").populate("adminId").lean();

return balanceRequests;
}
const totalBalanceRequest=async()=>{
  const balanceRequests = await BalanceRequest.find().populate("agentId").populate("adminId").lean()
  return balanceRequests
}
export const balanceRequestService = {
  balanceFromAgent,
  approvedBalanceRequest,
  getMyBalanceRequestFromDB,
  totalBalanceRequest
};
