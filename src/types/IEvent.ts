import mongoose from "mongoose";


export interface IEvent extends mongoose.Document {
  _id: string;
  sport: string;
  team1: string;
  team2: string;
  odds1: number;
  odds2: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
