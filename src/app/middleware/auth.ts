import { verifyToken } from './../utils/tokenUtils';
import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import config from '../config';
import { User } from '../modules/user/user.model';
import { JwtPayload } from 'jsonwebtoken';

export const USER_ROLE = {
  admin: 'admin',
  user: 'user',
  agent: 'agent',
} as const;
type TUserRole = keyof typeof USER_ROLE;
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_access_secret);

    const { role, id, iat } = decoded;

    // checking if the user is exist
    const user = await User.findById({ _id: id });

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted

    // const isDeleted = user?.isDeleted;

    if (user.status === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }
    if (user.sessionId !== decoded.sessionId) {
      throw new AppError(401, 'Session expired. Please log in again.');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized Person!',
      );
    }

    req.user = decoded as JwtPayload & { role: string };
    next();
  });
};

export default auth;
