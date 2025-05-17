import express, { Request, Response, NextFunction } from "express";
import Swap from "../Model/Swap";

const router = express.Router();
router.post('/swap', async (req:Request, res:Response) => {
  const { fromToken, toToken, amount, userAddress } = req.body;

  // Get rate from DEX or static pricing
  const rate = await getExchangeRate(fromToken, toToken);
  const expectedAmount = amount * rate;

  // Generate unique deposit address (Plume)
  const depositAddress = await generatePlumeAddress();

  const swap = new Swap({
    fromToken,
    toToken,
    amount,
    rate,
    expectedAmount,
    userAddress,
    depositAddress,
  });

  await swap.save();
  res.json({ depositAddress, expectedAmount });
});
// Called when deposit confirmed
const fulfillSwap = async (swapId) => {
  const swap = await Swap.findById(swapId);
if (!swap || swap.status !== 'PENDING') return;

  // Confirm receipt on-chain
  const received = await checkDeposit(swap.depositAddress);
  if (!received) return;

  // Send ATOM to user address
  const txHash = await sendATOM(swap.userAddress, swap.expectedAmount);

  swap.status = 'COMPLETED';
  swap.txHash = txHash;
  await swap.save();
};

const cron = require('node-cron');

cron.schedule('* * * * *', async () => {
  const pendingSwaps = await Swap.find({ status: 'PENDING' });
  for (let swap of pendingSwaps) {
    await fulfillSwap(swap._id);
  }
});

// const express = require("express");
// const SwapRequest = require("../models/SwapRequest");
// const { generateAddress, checkDeposit, sendToken } = require("../services/ethereum");

// const router = express.Router();

// // Swap Request
// router.post("/create", async (req, res) => {
//   try {
//     const { fromToken, fromChain, toToken, toChain, amount, userAddress } = req.body;

//     // Generate deposit address for the selected chain
//     const depositAddress = await generateAddress(fromChain);

//     // Calculate estimated amount (fetch from CoinGecko)
// const exchangeRate = await getSwapRate(fromToken, toToken);
//     const expectedAmount = amount * exchangeRate;

//     // Store swap request
//     const swap = await SwapRequest.create({
//       fromToken,
//       fromChain,
//       toToken,
//       toChain,
//       amount,
//       expectedAmount,
//       userAddress,
//       depositAddress,
//       rate: exchangeRate,
//       status: "PENDING",
//     });

//     res.json({ success: true, depositAddress, expectedAmount });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create swap request" });
//   }
// });

// module.exports = router;