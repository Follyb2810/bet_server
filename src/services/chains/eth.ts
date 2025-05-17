// const ethers = require("ethers");
import ethers from 'ethers'
import Swap from '../../Model/Swap';
import axios from 'axios';
const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC);
const wallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY!, provider);

export async function generateAddress() {
  return wallet.address;
}

export async function checkDeposit(address:string, expectedAmount:string) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance) >= expectedAmount;
}

export async function sendToken(to:string, amount:number) {
const tx = await wallet.sendTransaction({ to, value: ethers.parseEther(amount.toString()) });
  return tx.hash;
}
export async function sendEthereumToken(to:string, amount:string) {
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount.toString()),
  });
  return tx.hash;
}
// module.exports = { generateAddress, checkDeposit, sendToken };

// const { ethers } = require("ethers");

// RPC URLs for different chains
const RPC_URLS = {
  ethereum: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
  bsc: "https://bsc-dataseed.binance.org/",
  polygon: "https://polygon-rpc.com/",
  arbitrum: "https://arb1.arbitrum.io/rpc",
};

// Example: Use Ethereum Mainnet
// const provider = new ethers.JsonRpcProvider(RPC_URLS.ethereum);

// ERC-20 Token ABI (only balanceOf function is needed)
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
];

// Function to check ERC-20 token balance
async function checkERC20Deposit(walletAddress:string, tokenAddress:string) {
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await tokenContract.balanceOf(walletAddress);
  console.log(`Balance of tokenAddress in{walletAddress}:`, ethers.formatUnits(balance, 18));
  return ethers.formatUnits(balance, 18); // Convert balance to readable format
}

// export async function checkIncomingTransactions() {
//   const latestBlock = await provider.getBlockNumber();
//   const block = await provider.getBlockWithTransactions(latestBlock);
//   // const block = await provider.getBlockWithTransactions(latestBlock);

//   for (const tx of block.transactions) 
//     const swapRequest = await Swap.findOne( depositAddress: tx.to );

//     if (swapRequest) {

//       console.log(`Deposit detected:{tx.value} ETH from ${tx.from}`);
//     }
//       // Process the swap...
//   }
  
// async function checkSolanaTransactions() {
//   const confirmedSignatures = await connection.getSignaturesForAddress(new PublicKey(process.env.SOLANA_MAIN_WALLET));
// for (const signature of confirmedSignatures) 
//     const tx = await connection.getParsedTransaction(signature.signature);
    
//     tx?.transaction.message.accountKeys.forEach(async (account) => 
//       const swapRequest = await Swap.findOne( depositAddress: account.pubkey.toBase58() );

//       if (swapRequest) 
//         console.log(Deposit detected for{swapRequest.depositAddress});
//         // Process the swap...
//       }
//     });
//   }
// }

// setInterval(checkSolanaTransactions, 5000);
export async function swapTokens(sourceToken: string, targetToken: string, amount: number): Promise<number> {
  const response = await axios.get(`https://api.dex.com/price?from=sourceTokento={targetToken}`);
  const exchangeRate = response.data.price;
  
  return amount * exchangeRate; 
}
const masterWallet = ethers.Wallet.fromPhrase(process.env.MASTER_MNEMONIC!);

const masterSigner = masterWallet.connect(provider);

/**
 * Generate a unique deposit address for each user
 */
export function generateEvmDepositAddress(index: number): string {
const hdNode = ethers.HDNodeWallet.fromMnemonic(masterWallet.mnemonic!, `m/44'/60'/0'/0/${index}`);
  return hdNode.address;
}
// Example Usage
const userWallet = "0xYourWalletAddressHere"; 
const USDC_ETH = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48"; // USDC on Ethereum
checkERC20Deposit(userWallet, USDC_ETH);

const fetch = require("node-fetch");

const ONEINCH_API = "https://api.1inch.io/v5.0/1/swap";

async function getERC20Swap(fromToken:string, toToken:string, amount:string, walletAddress:string) {
  const url = `ONEINCH_API?fromTokenAddress={fromToken}&toTokenAddress=toToken   amount={amount}&fromAddress=${walletAddress}&slippage=1`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Example: Swap USDT → USDC
const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48";
const amount = "1000000"; // 1 USDT (6 decimals)
const walletAddress = "0xYourEthereumWalletAddress";

getERC20Swap(USDT, USDC, amount, walletAddress).then(console.log);