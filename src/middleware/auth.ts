import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export type IUserJwt = { userId: string };

export interface AuthRequest extends Request {
  user?: IUserJwt | JwtPayload;  
}

export const auth: RequestHandler = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
      return
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;
      req.user = decoded;  
      next();  
    } catch (err) {
      res.status(401).json({ msg: 'Token is not valid' });
    }
  } catch (err) {
    next(err); 
    res.status(500).json({ msg: 'Server error' });
  }
};



// export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
// const token = req.header("Authorization")?.split(" ")[1];
//   if (!token) return res.status(401).json({ message: "Access Denied" });
// try {
//     const verified = verify(token, process.env.JWT_SECRET as string);
//     req.user = verified;
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };