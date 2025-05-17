import mongoose, { Schema, model, models } from "mongoose";
import { BetStatus, IBet } from "../types/IBet";

const betSchema = new Schema<IBet>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    amount: { type: Number, required: true },
    selection: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BetStatus),
      default: BetStatus.NotStarted,
    },
      // type: { type: String, enum: ['pre-match', 'in-play'], default: 'pre-match' },
  },
  { timestamps: true }
);

export default models.Bet || model<IBet>("Bet", betSchema);
