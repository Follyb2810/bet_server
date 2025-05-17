import mongoose, { Schema, model, models } from "mongoose";
import { IEvent } from "../types/IEvent";

const betSchema = new Schema<IEvent>(
  {
    sport: { type: String, required: true },
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    odds1: { type: Number, required: true },
    odds2: { type: Number, required: true },
    date: { type: Date, required: true },
  //     type: { type: String, enum: ['football', 'dog_race'], required: true },
  // sport: { type: String, required: true }, // e.g., "Virtual Football", "Virtual Dog Racing"
  // participants: [{ name: String, odds: Number }], // Teams or dogs
  // date: { type: Date, required: true },
  // status: { type: String, enum: ['upcoming', 'in-play', 'finished'], default: 'upcoming' },
  },
  { timestamps: true }
);

export default models.Bet || model<IEvent>("Bet", betSchema);
// const eventSchema = new mongoose.Schema({
//   sport: { type: String, required: true },
//   team1: { type: String, required: true },
//   team2: { type: String, required: true },
//   odds1: { type: Number, required: true },
//   odds2: { type: Number, required: true },
//   date: { type: Date, required: true },
//   status: { type: String, enum: ['upcoming', 'in-play', 'finished'], default: 'upcoming' },
// });

