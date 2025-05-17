import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  name: string;
  symbol: string;
  network: string;
  mintAddress: string;
  isActive: boolean;
}

const TokenSchema = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true, unique: true },
  network: { type: String, required: true },
  mintAddress: { type: String, required: true },
  isActive: { type: Boolean, default: true },
});

export const Token = mongoose.model<IToken>("Token", TokenSchema);