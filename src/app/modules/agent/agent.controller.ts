import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { AgentServices } from './agent.services';
import sendResponse from '../../utils/sendResponse';

const createAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user;

  const result = await AgentServices.createAnAgent(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Agent Created successfully Please Wait for admin Approve',
    data: result,
  });
});
const getAllAgentFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await AgentServices.getAllAgentFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agents Retrieved successfully',
    data: result,
  });
});
const approvedAgent = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.body;
  const result = await AgentServices.approvedAgent(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Agents Approved successfully',
    data: result,
  });
});

export const AgentController = {
  createAgent,
  getAllAgentFromDB,
  approvedAgent
};
