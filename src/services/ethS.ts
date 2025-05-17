const fetch = require("node-fetch");

const ONEINCH_API = "https://api.1inch.io/v5.0/1/swap";

async function getERC20Swap(fromToken, toToken, amount, walletAddress) {
  const url = `ONEINCH_API?fromTokenAddress={fromToken}&toTokenAddress=toToken   amount={amount}&fromAddress=${walletAddress}&slippage=1`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Example: Swap USDT → USDC
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48";
const amount = "1000000"; // 1 USDT (6 decimals)
const wallet = "0xYourEthereumWalletAddress";

getERC20Swap(USDT, USDC, amount, wallet).then(console.log);