
import Queue from 'bull'
import Swap from '../Model/Swap';
import { checkSolanaDeposit, sendSolanaToken } from '../services/chains/solana';
import { sendEthereumToken } from '../services/chains/eth';

const swapQueue = new Queue("swap-processing");

export const que = swapQueue.process(async (job) => {
  const swap = job.data;


  const confirmed = await checkDeposit(swap.depositAddress, swap.amount);
  if (!confirmed) return swapQueue.add(swap, { delay: 30000 }); 

  const txHash = await sendToken(swap.userAddress, swap.expectedAmount);
  await Swap.findByIdAndUpdate(swap._id, { status: "COMPLETED", txHash });
});
// module.exports = swapQueue;
// const Queue = require("bull");
// const { checkEthereumDeposit, sendEthereumToken } = require("../services/ethereum");
// const { checkSolanaDeposit, sendSolanaToken } = require("../services/solana");
// const SwapRequest = require("../models/SwapRequest");

// const swapQueue = new Queue("swap-processing");

export const que2 = swapQueue.process(async (job) => {
  const swap = job.data;

  let confirmed = false;

  if (swap.fromChain === "Ethereum" || swap.fromChain === "Arbitrum") {
    confirmed = await checkEthereumDeposit(swap.depositAddress, swap.amount);
  } else if (swap.fromChain === "Solana") {
    confirmed = await checkSolanaDeposit(swap.depositAddress, swap.amount);
  }

  if (!confirmed) return swapQueue.add(swap, { delay: 30000 }); // Retry after 30 sec

  let txHash;
  if (swap.toChain === "Ethereum" || swap.toChain === "Arbitrum") {
    txHash = await sendEthereumToken(swap.userAddress, swap.expectedAmount);
  } else if (swap.toChain === "Solana") {
    txHash = await sendSolanaToken(swap.userAddress, swap.expectedAmount);
  }

  await Swap.findByIdAndUpdate(swap._id, { status: "COMPLETED", txHash });
});

// module.exports = swapQueue;

// const swapQueue = require("../workers/queue");

// async function processJUPSwap(depositAddress, expectedAmount, userAddress) {
//   const receivedAmount = await checkJUPDeposit(depositAddress);

//   if (receivedAmount >= expectedAmount) {
//     console.log(`Confirmed JUP deposit: ${receivedAmount} JUP`);

//     // Add to swap queue
//     swapQueue.add({
//       fromToken: "JUP",
//       fromChain: "Solana",
// toChain: "Ethereum",
//       amount: receivedAmount,
//       userAddress: userAddress,
//     );
//    else 
//     console.log("JUP deposit not received yet, retrying...");
//     setTimeout(() => processJUPSwap(depositAddress, expectedAmount, userAddress), 30000);
//   “`
// ✅ If the *correct amount of JUP* is received, we add it to the *swap queue* for processing.

// —

// *📌 Step 4: Send Tokens to User*
// After confirming the deposit, we send *ETH (or any other token)* to the user's address.

// *🔹 Send ETH after Swap*
// “`js
// const  Wallet, ethers  = require("ethers");

// const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC);
// const wallet = new Wallet(process.env.ETH_PRIVATE_KEY, provider);

// async function sendEthereumToken(to, amount) 
//   const tx = await wallet.sendTransaction(
//     to,
//     value: ethers.parseEther(amount.toString()),
//   );

//   console.log(`ETH Sent:{tx.hash}`);
//   return tx.hash;
// }