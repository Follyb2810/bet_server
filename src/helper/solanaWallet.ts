import { Keypair, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

const masterKeypair = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY!));

export function generateSolanaDepositAddress(index: number): string {
  const derivedKeypair = Keypair.generate();
  return derivedKeypair.publicKey.toBase58();
}
// async function checkSolanaTransactions() 
//   const confirmedSignatures = await connection.getSignaturesForAddress(new PublicKey(process.env.SOLANA_MAIN_WALLET));

//   for (const signature of confirmedSignatures) 
//     const tx = await connection.getParsedTransaction(signature.signature);
    
//     tx?.transaction.message.accountKeys.forEach(async (account) => 
//       const deposit = await DepositAddress.findOne( address: account.pubkey.toBase58() );

//       if (deposit) 
//         console.log(Deposit detected for{deposit.address});
//         // Add swap logic here
//       }
//     });
//   }
// }

// setInterval(checkSolanaTransactions, 5000);


