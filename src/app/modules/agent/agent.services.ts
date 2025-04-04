import httpStatus, { status } from 'http-status';
import AppError from '../../errors/AppError';
import { IAgent } from './agent.interface';
import { Agent } from './agent.module';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { USER_ROLE } from '../../middleware/auth';

const createAnAgent = async (id: string, payload: IAgent) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'user Not found');
  }

  const isUserBecomeAgent = await Agent.findOne({ userId: user._id });
  if (isUserBecomeAgent) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User has already become an agent',
    );
  }
  payload.userId = user._id as any;
  payload.status = 'in-progress';
  const agent = await Agent.create(payload);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, 'Agent can not create');
  }
  return agent;
};
const getAllAgentFromDB = async () => {
  const agents = await Agent.find({})
    .populate({
      path: 'userId',
      match: { status: { $ne: 'blocked' } }, // Exclude blocked users
      select: '-pin', // Exclude sensitive fields like 'pin'
    })
    .limit(100)
    .sort({ createdAt: -1 });
  //todo: find recent 100 agent
  if (!agents) {
    throw new AppError(httpStatus.NOT_FOUND, 'No agents found');
  }
  return agents;
};
// Assuming roles are defined here

const approvedAgent = async ( payload: { id:string,status: string }) => {
  const session = await mongoose.startSession(); // Start transaction session
  session.startTransaction();

  try {
    
    // Step 1: Find the agent inside the transaction
    const agent = await Agent.findOne({ _id: payload.id }).session(session);
    if (!agent) {
      throw new AppError(httpStatus.NOT_FOUND, 'Agent not found');
    }
    // Step 2: Find the user inside the transaction
    const user = await User.findOne({ _id: agent.userId }).session(session);
    if(!user){
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
     }
    if(user.status==="blocked"){
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
     }
    // Step 3: Update the agent status

    if (agent.status && payload.status === 'approved') {
      agent.status = 'approved';
    }
    if (agent.status && payload.status === 'rejected') {
      agent.status = 'rejected';
    }

    // Step 4: Update the user role
    user.accountType = USER_ROLE.agent;
    user.balance += 100000;
    // Step 5: Save both documents inside the session
    await agent.save({ session });
    await user.save({ session });

    // Step 6: Commit transaction
    await session.commitTransaction();
    session.endSession();

    return agent;
  } catch (error) {
    // Rollback transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw error; // Re-throw error for handling in upper layers
  }
};

export default approvedAgent;

export const AgentServices = {
  createAnAgent,
  getAllAgentFromDB,
  approvedAgent,
};
