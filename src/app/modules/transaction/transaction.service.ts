import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TTransaction } from './transaction.validation';
import generateTransactionId from '../../utils/generateTransactionId';
import { Transaction } from './transaction.model';
import createNotification from '../../utils/createNotification';
import comparPassword from '../../utils/comparPassword';


//send money
const sendMoney = async (id: string, payload: TTransaction) => {
  const { mobileNumber, amount, pin } = payload;

  // Validate the amount
  if (Number(amount) < 50) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Minimum amount is 50 taka');
  }

  // Start a Mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the sender, recipient, and admin within the transaction
    const sender = await User.findById(id).session(session);
    if (!sender) {
      throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');
    }
    const isPinMatch = comparPassword(pin, sender.pin);
    if (!isPinMatch) {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid PIN');
    }
    if (sender.mobileNumber.trim() === mobileNumber.trim()) {
      throw new AppError(httpStatus.FORBIDDEN, 'Cannot send money to yourself');
    }

    const recipient = await User.findOne({ mobileNumber }).session(session);
    if (!recipient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Recipient not found');
    }

    const admin = await User.findOne({ accountType: 'admin' }).session(session);
    if (!admin) {
      throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    // Calculate the fee based on the amount
    const fee = amount < 100 ? 0 : 5; // Fee is 0 for amounts less than 100, otherwise 5 taka

    // Calculate the total amount to be deducted from the sender
    const totalAmount = amount + fee;

    // Check if the sender has sufficient balance
    if (sender.balance < totalAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    // Update balances
    sender.balance -= totalAmount;
    recipient.balance += amount;
    admin.bonus += fee;

    // Save the updated balances within the transaction
    await sender.save({ session });
    await recipient.save({ session });
    await admin.save({ session });

    // Generate a unique transaction ID
    const transactionId = generateTransactionId();

    // Create the transaction payload
    const transactionPayload = {
      senderId: sender._id,
      recipientId: recipient._id,
      adminId: admin._id,
      amount,
      fee,
      type: 'sendMoney',
      transactionId,
    };

    // Save the transaction to the database within the transaction
    await Transaction.create([transactionPayload], { session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    // Notify the sender
    await createNotification(
      sender._id.toString(),
      transactionId,
      `You sent ${amount} taka to ${recipient.mobileNumber}. Fee: ${fee} taka.`,
    );

    // Notify the recipient

    await createNotification(
      recipient._id.toString(),
      transactionId,
      `You received ${amount} taka from ${sender.mobileNumber}.`,
    );
    // Notify the admin
    await createNotification(
      admin._id.toString(),
      transactionId,
      `Transaction ID: ${transactionId} -${sender.mobileNumber}sent ${amount} Taka to  Mobile:${recipient.mobileNumber}. you received ${fee} Taka as a Admin fee.`,
    );
  } catch (error) {
    // Abort the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  return null;
};

// ------------------------------------------------------------
//cashIn User from agent
const cashIn = async (id: string, payload: TTransaction) => {
  const { mobileNumber, amount, pin } = payload;
  // Start a Mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await User.findById(id).session(session);
    if (!sender) {
      throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');
    }
    const isPinMatch = comparPassword(pin, sender.pin);
    if (!isPinMatch) {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid PIN');
    }
    if (sender.mobileNumber.trim() === mobileNumber.trim()) {
      throw new AppError(httpStatus.FORBIDDEN, 'Cannot send money to yourself');
    }
    const recipient = await User.findOne({ mobileNumber }).session(session);
    if (!recipient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Recipient not found');
    }

    const admin = await User.findOne({ accountType: 'admin' }).session(session);
    if (!admin) {
      throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
    }

    // Check if the sender has sufficient balance
    if (sender.balance < amount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }
    let fee = 0;
    // Update balances
    sender.balance -= amount;
    recipient.balance += amount;

    // Save the updated balances within the transaction
    await sender.save({ session });
    await recipient.save({ session });
    // Generate a unique transaction ID
    const transactionId = generateTransactionId();

    // Create the transaction payload
    const transactionPayload = {
      senderId: sender._id,
      recipientId: recipient._id,
      adminId: admin._id,
      amount,
      fee,
      type: 'cashIn',
      transactionId,
    };

    // Save the transaction to the database within the transaction
    await Transaction.create([transactionPayload], { session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    // Notify the sender
    await createNotification(
      sender._id.toString(),
      transactionId,
      `You send cashIn ${amount} taka to ${recipient.mobileNumber}. Fee: ${fee} taka.`,
    );

    // Notify the recipient

    await createNotification(
      recipient._id.toString(),
      transactionId,
      `You received cashIn from ${amount} taka from ${sender.mobileNumber}.`,
    );
    // Notify the admin
    await createNotification(
      admin._id.toString(),
      transactionId,
      `Transaction ID: ${transactionId} - ${sender.mobileNumber} sent ${amount} Taka to ${recipient.mobileNumber}. you received ${fee} Taka as a fee.`,
    );
  } catch (error) {
    // Abort the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
  return null;
};

// -----------------------------------------------
const cashOut = async (id: string, payload: TTransaction) => {
  const { mobileNumber, amount, pin } = payload;

  // Start a Mongoose session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the sender, recipient, and admin within the transaction
    const sender = await User.findById(id).session(session);
    if (!sender) {
      throw new AppError(httpStatus.NOT_FOUND, 'Sender not found');
    }

    // Verify the sender's PIN
    const isPinMatch = comparPassword(pin, sender.pin);
    if (!isPinMatch) {
      throw new AppError(httpStatus.FORBIDDEN, 'Invalid PIN');
    }
    if (sender.mobileNumber.trim() === mobileNumber.trim()) {
      throw new AppError(httpStatus.FORBIDDEN, 'Cannot send money to yourself');
    }
    const recipient = await User.findOne({ mobileNumber }).session(session);
    if (!recipient) {
      throw new AppError(httpStatus.NOT_FOUND, 'Recipient not found');
    }

    const admin = await User.findOne({ accountType: 'admin' }).session(session);
    if (!admin) {
      throw new AppError(httpStatus.NOT_FOUND, 'Admin not found');
    }
    if (
      !(recipient.accountType === 'agent' || recipient.accountType === 'admin')
    ) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        `Recipient must be an Agent Or Admin`,
      );
    }
    // Calculate fees
    const cashoutCharge = (amount * 1.5) / 100; // 1.5% of the amount
    const agentFee = (amount * 1) / 100; // 1% of the amount
    const adminFee = (amount * 0.5) / 100; // 0.5% of the amount

    // Calculate the total amount to be deducted from the sender
    const totalAmount = amount + cashoutCharge;

    // Check if the sender has sufficient balance
    if (sender.balance < totalAmount) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Insufficient balance');
    }

    // Update balances
    sender.balance -= totalAmount; // Deduct amount + cashOut charge
    recipient.balance += amount; // Recipient receives the full amount
    admin.bonus += adminFee; // Admin gets 0.5%
    recipient.bonus += agentFee; // Agent gets 1% (assuming the recipient is the agent)

    // Save the updated balances within the transaction
    await sender.save({ session });
    await recipient.save({ session });
    await admin.save({ session });

    // Generate a unique transaction ID
    const transactionId = generateTransactionId();

    // Create the transaction payload
    const transactionPayload = {
      senderId: sender._id,
      recipientId: recipient._id,
      adminId: admin._id,
      amount,
      fee: cashoutCharge,
      type: 'cashOut',
      transactionId,
    };

    // Save the transaction to the database within the transaction
    await Transaction.create([transactionPayload], { session });

    // Commit the transaction if all operations succeed
    await session.commitTransaction();
    session.endSession();

    // Notify the sender
    await createNotification(
      sender._id.toString(),
      transactionId,
      `You cashed out ${amount} taka to ${recipient.mobileNumber}. CashOut Charge: ${cashoutCharge} taka.`,
    );

    // Notify the recipient (agent)
    await createNotification(
      recipient._id.toString(),
      transactionId,
      `You received ${amount} taka from ${sender.mobileNumber}. Agent Fee: ${agentFee} taka.`,
    );

    // Notify the admin
    await createNotification(
      admin._id.toString(),
      transactionId,
      `Transaction ID: ${transactionId} - ${sender.mobileNumber} cashed out ${amount} Taka to ${recipient.mobileNumber}. You received ${adminFee} Taka as a Admen fee.`,
    );
  } catch (error) {
    // Abort the transaction if any operation fails
    await session.abortTransaction();
    session.endSession();
    throw error;
  }

  return { message: 'CashOut successfully' };
};

const getTransactionByMe = async (id: string) => {
  // Fetch transactions using aggregation
  const transactions = await Transaction.aggregate([
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(id) },
          { recipientId: new mongoose.Types.ObjectId(id) },
          { adminId: new mongoose.Types.ObjectId(id) },
        ],
      },
    },
    // Lookup sender details from the User collection
    {
      $lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        as: 'sender',
      },
    },
    // Lookup recipient details from the User collection
    {
      $lookup: {
        from: 'users',
        localField: 'recipientId',
        foreignField: '_id',
        as: 'recipient',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'adminId',
        foreignField: '_id',
        as: 'admin',
      },
    },
    // Unwind sender and recipient arrays (since $lookup returns an array)
    {
      $unwind: '$sender',
    },
    {
      $unwind: '$recipient',
    },
    {
      $unwind: '$admin',
    },
    // Project only the required fields
    {
      $project: {
        _id: 1,
        amount: 1,
        fee: 1,
        type: 1,
        transactionId: 1,
        createdAt: 1,
        sender: {
          _id: 1,
          name: 1,
          mobileNumber: 1,
          accountType: 1,
        },
        recipient: {
          _id: 1,
          name: 1,
          mobileNumber: 1,
          accountType: 1,
        },
        admin: {
          _id: 1,
          name: 1,
          mobileNumber: 1,
          accountType: 1,
        },
      },
    },
  ]);
  return transactions;
};

const getTransactionFromDB = async () => {
  const result = await Transaction.find().sort({ createdAt: -1 });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Transition Found');
  }
  return result;
};
const getTodaysTransaction = async (id: string) => {
  // todayStart
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  // todyEnd
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await Transaction.aggregate([
    {
      $match: {
        $or: [{ senderId: user.id }, { recipientId: user.id }],
        createdAt: { $gte: todayStart, $lte: todayEnd },
      },
    },
    {
      $group: {
        _id: '$type',
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);
// Initialize totals
const totals = {
  cashout: 0,
  sendMoney: 0,
  cashin: 0,
};

// Populate totals based on the result
result.forEach((item) => {
  if (item._id === "cashout") {
    totals.cashout = item.totalAmount;
  } else if (item._id === "sendMoney") {
    totals.sendMoney = item.totalAmount;
  } else if (item._id === "cashin") {
    totals.cashin = item.totalAmount;
  }
});

return totals;

};

const getMonthlyTransactions=async(userId:string)=>{
  let year= new Date().getFullYear()
  console.log(year)
  const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  const transactions = await Transaction.find({
    $or: [{ senderId: userId }, { recipientId: userId }],
    createdAt: { $gte: startDate, $lte: endDate },
  });

  const monthlyData = Array(12)
    .fill(0)
    .map((_, index) => ({
      name: new Date(year, index).toLocaleString('default', { month: 'short' }),
      totalAmount: 0,
      totalFees: 0,
    }));

  transactions.forEach((transaction: any) => {
    const month = new Date(transaction.createdAt).getMonth();
    monthlyData[month].totalAmount += transaction.amount;
    monthlyData[month].totalFees += transaction.fee;
  });

  return monthlyData;
}

export const TransactionServices = {
  sendMoney,
  cashIn,
  cashOut,
  getTransactionFromDB,
  getTransactionByMe,
  getTodaysTransaction,
  getMonthlyTransactions
};
