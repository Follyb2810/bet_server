import TronWeb from "tronweb";

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: process.env.TRON_PRIVATE_KEY,
});

export async function generateTronAddress() {
  const account = await tronWeb.createAccount();
  return account.address.base58;
}
export async function checkTronDeposit(address:string, expectedAmount:number){
  const balance = await tronWeb.trx.getBalance(address);
  return balance / 1e6 >= expectedAmount; 
}
