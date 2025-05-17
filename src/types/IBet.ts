import { Document, Types } from "mongoose";

export interface IBet extends Document {
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
  amount: number;
  selection: string;
  status: BetStatus;
  createdAt: Date;
  updatedAt: Date;
}
export enum BetStatus {
  NotStarted = "not start",
  Playing = "playing",
  Loss = "loss",
  Won = "won"
}
