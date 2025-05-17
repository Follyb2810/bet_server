import mongoose, { Schema, model, models } from "mongoose";

const swapRequestSchema = new mongoose.Schema({
  fromToken: String,
  toToken: String,
  amount: Number,
  rate: Number,
  expectedAmount: Number,

  userAddress: String,
  depositAddress: String,
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "COMPLETED", "FAILED"],
    default: "PENDING",
  },
  txHash: String,
  createdAt: { type: Date, default: Date.now },
});

export default models.Swap || model("SwapRequest", swapRequestSchema);
// export default models.Bet || model<IBet>("Bet", swapRequestSchema);

// const swapRequestSchema = new mongoose.Schema({
//   fromToken: String,
//   fromChain: String,
//   toToken: String,
//   toChain: String,
//   amount: Number,
//   expectedAmount: Number,
//   userAddress: String,
//   depositAddress: String,
//   rate: Number,
//   status: {
//     type: String,
//     enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED'],
//     default: 'PENDING'
//   },
//   txHash: String,
//   createdAt: { type: Date, default: Date.now }
// });


// const swapRequestSchema = new mongoose.Schema({
//   fromToken: String,    // e.g., "TRUMP"
//   fromChain: String,    // e.g., "Solana"
//   toToken: String,      // e.g., "ETH"
// toChain: String,      // e.g., "Arbitrum"
//   amount: Number,
//   expectedAmount: Number,
//   userAddress: String,  // Where user will receive the swapped token
//   depositAddress: String,  // The address where the user must send tokens
//   rate: Number,
//   status: {
//     type: String,
//     enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'FAILED'],
//     default: 'PENDING'
//   },
//   txHash: String,  // Transaction hash for tracking
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("SwapRequest", swapRequestSchema);
