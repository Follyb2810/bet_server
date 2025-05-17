import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const masterWallet = ethers.Wallet.fromPhrase(process.env.MASTER_MNEMONIC!).connect(provider);

/**
* Generate a new deposit address for a user
 */
export function generateEvmDepositAddress(index: number): string {
  const wallet = ethers.HDNodeWallet.fromMnemonic(masterWallet.mnemonic!, `m/44'/60'/0'/0/${index}`);
  return wallet.address;
}