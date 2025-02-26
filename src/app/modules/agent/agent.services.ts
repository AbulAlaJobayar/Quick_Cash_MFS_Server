import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IAgent } from './agent.interface';
import { Agent } from './agent.module';
import { User } from '../user/user.model';

const createAnAgent = async (id: string, payload: IAgent) => {
  const user = await User.findById({ _id: id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'user Not found');
  }
  payload.userId = user._id as any;
  const agent = await Agent.create(payload);
  if (!agent) {
    throw new AppError(httpStatus.NOT_FOUND, 'Agent can not create');
  }
  return agent;
};
const getAllAgentFromDB = async () => {
  const agents = await Agent.find({}).populate({
    path: 'user',
    match: { status: { $ne: 'blocked' } }, // Exclude blocked users
    select: '-pin', // Exclude sensitive fields like 'pin'
  });
  if (!agents) {
    throw new AppError(httpStatus.NOT_FOUND, 'No agents found');
  }
  return agents;
};

const approvedAgent = async (id: string) => {
  const result = await Agent.findByIdAndUpdate({
    _id: id,
  },{
    
  });
};
export const AgentServices = {
  createAnAgent,
  getAllAgentFromDB,
};
