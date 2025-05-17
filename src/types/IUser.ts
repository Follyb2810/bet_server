import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Types } from 'mongoose';

export enum Roles {
  USER='user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export interface IUser extends mongoose.Document {
    _id: string;
    username?: string;
    email?: string;
    password?: string;
    role?: Roles[];
    profile?: { 
      name?: string;
      bio?: string;
      avatar?: string;
    };
    refreshToken?: string;
    isVerified?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IAuthRequest extends Request {
    user?: JwtPayload & { id: string; role: Roles[] };
}