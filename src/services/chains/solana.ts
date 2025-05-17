import { Keypair, Connection, PublicKey } from "@solana/web3.js";
import { sendAndConfirmTransaction, Transaction, SystemProgram } from "@solana/web3.js"
import bs58 from 'bs58'

export const connection = new Connection("https://api.mainnet-beta.solana.com");
export async function generateSolanaAddress() {
  const keypair = Keypair.generate();
  return keypair.publicKey.toString();
}

export async function checkSolanaDeposit(address:string, expectedAmount:number) {
  const balance = await connection.getBalance(new PublicKey(address));
  return balance / 1e9 >= expectedAmount; // Convert from lamports
}


export async function sendSolanaToken(to:string, amount:number) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: new PublicKey(to),
      lamports: amount * 1e9, // Convert to lamports
    })
  );

  const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
  return signature;
}

// const { Connection, PublicKey } = require("@solana/web3.js");

// const connection = new Connection("https://api.mainnet-beta.solana.com");

async function checkJUPDeposit(depositAddress:string) {
  const pubKey = new PublicKey(depositAddress);

  const transactions = await connection.getConfirmedSignaturesForAddress2(pubKey, { limit: 5 });

for (const tx of transactions) {
    const txDetails = await connection.getParsedTransaction(tx.signature, "confirmed");
    

    for (const instruction of txDetails!.transaction.message.instructions) {
      if (instruction.program === "spl-token") {
    //   if (instruction.program === "spl-token") {
        const parsed = instruction.parsed;
        
        // Check if this is a transfer of JUP token
        if (parsed.info.mint === "JUPITER_MINT_ADDRESS_HERE") { // Replace with actual JUP mint address
          console.log(`JUP Deposit Detected: parsed.info.amount JUP from{parsed.info.source}`);
          return parsed.info.amount;
        }
      }
    }
  }

  return 0;
}

const JUP_MINT_ADDRESS = "JUP_MINT_ADDRESS_HERE";

export async function checkTokenDeposit(depositAddress:string) {
  const pubKey = new PublicKey(depositAddress);

  const transactions = await connection.getConfirmedSignaturesForAddress2(pubKey, { limit: 5 });
for (const tx of transactions) {
    const txDetails = await connection.getParsedTransaction(tx.signature, "confirmed");

    for (const instruction of txDetails.transaction.message.instructions) {
      if (instruction.program === "spl-token") {
        const parsed = instruction.parsed;
        
        if (parsed.info.mint === JUP_MINT_ADDRESS) {
          console.log(`✅ JUP Deposit Detected: parsed.info.amount JUP from{parsed.info.source}`);
          return parsed.info.amount;
        }
      }
    }
  }

  return 0;
}

// module.exports = { checkTokenDeposit };

// module.exports = { checkJUPDeposit };
export const TOKEN_MINTS:Record<string,string> = {
  JUP: "JUP_MINT_ADDRESS_HERE",
  USDC: "USDC_MINT_ADDRESS_HERE",
  BONK: "BONK_MINT_ADDRESS_HERE",
  WETH: "WETH_MINT_ADDRESS_HERE",
};
export function getTokenNameByMint(mintAddress:string) {
  return Object.keys(TOKEN_MINTS).find((key) => TOKEN_MINTS[key] === mintAddress) || "Unknown Token";
}
async function checkAnyTokenDeposit(depositAddress:string) {
  const pubKey = new PublicKey(depositAddress);
  const transactions = await connection.getConfirmedSignaturesForAddress2(pubKey, { limit: 5 });

  for (const tx of transactions) {
    const txDetails = await connection.getParsedTransaction(tx.signature, "confirmed");

    for (const instruction of txDetails.transaction.message.instructions) {
      if (instruction.program === "spl-token") {
        const parsed = instruction.parsed;
        const tokenName = getTokenNameByMint(parsed.info.mint);

        if (tokenName !== "Unknown Token") {
          console.log(`✅ Deposit Detected: parsed.info.amount{tokenName} from ${parsed.info.source}`);
          return { token: tokenName, amount: parsed.info.amount };
        }
      }
    }
  }

  return null;
}

// const { Connection, PublicKey } = require("@solana/web3.js");
// const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
// const connection = new Connection(SOLANA_RPC_URL);

// // Mint address of the SPL token
// const JUP_MINT_ADDRESS = "JUP_MINT_ADDRESS_HERE";

// Function to check token transactions
async function checkSPLTokenDeposit(walletAddress:string) {
  const pubKey = new PublicKey(walletAddress);
  const transactions = await connection.getConfirmedSignaturesForAddress2(pubKey, { limit: 5 });

  for (const tx of transactions) {
    const txDetails = await connection.getParsedTransaction(tx.signature, "confirmed");

    for (const instruction of txDetails.transaction.message.instructions) {
      if (instruction.program === "spl-token") {
        const parsed = instruction.parsed;

        if (parsed.info.mint === JUP_MINT_ADDRESS) {
          console.log(`✅ JUP Deposit: parsed.info.amount JUP from{parsed.info.source}`);
          return parsed.info.amount;
        }
      }
    }
  }
}

const masterKeypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));

/**
 * Generate a new deposit address for a user
 */
export function generateSolanaDepositAddress(index: number): string {
  const derivedKeypair = Keypair.generate(); // Create a new keypair for tracking deposits
  return derivedKeypair.publicKey.toBase58();
}

// import bs58 from 'bs58'

// const bytes = Uint8Array.from([
//     0, 60,  23, 110, 101, 155, 234,
//    15, 41, 163, 233, 191, 120, 128,
//   193, 18, 177, 179,  27,  77, 200,
//    38, 38, 129, 135
// ])
// const address = bs58.encode(bytes)
// console.log(address)
// import bs58 from 'bs58'

// const address = '16UjcYNBG9GTK4uq2f7yYEbuifqCzoLMGS'
// const bytes = bs58.decode(address)
// // See uint8array-tools package for helpful hex encoding/decoding/compare tools
// console.log(Buffer.from(bytes).toString('hex'))
// // => 003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187


const JUP_API = "https://quote-api.jup.ag/v6";

async function getSwapQuote(inputMint:string, outputMint:string, amount:number) {
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