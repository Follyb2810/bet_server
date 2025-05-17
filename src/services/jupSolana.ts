const fetch = require("node-fetch");

const JUP_API = "https://quote-api.jup.ag/v6";

async function getSwapQuote(inputMint, outputMint, amount) {
  const url = `JUP_API/quote?inputMint={inputMint}&outputMint=outputMint   amount={amount}&slippageBps=50`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Example: Swap 1 SOL → USDC (Solana)
const SOL_MINT = "So11111111111111111111111111111111111111112"; 
const USDC_MINT = "EPjFWdd5AufqSSqeM2qE6ZL8im5B9Wtnb5DK8tc8P3w";
const amount = 1_000_000_000; // 1 SOL (LAMPORTS)

getSwapQuote(SOL_MINT, USDC_MINT, amount).then(console.log);