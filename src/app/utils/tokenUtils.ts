import jwt, { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

export type TJwtPayload = {
  id: Types.ObjectId
  mobileNumber: string;
  sessionId:string;
  role: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expireIn: string,
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: expireIn as string |any});
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
