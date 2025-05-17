import { Response } from "express";


export function ResponseHandler(
  res: Response,
  status: number,
  message: string,
  data: any = null
) {
  res.status(status).json({
    success: status < 400,
    status,
    message,
    data,
  });
}