const ethers = require('ethers');

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC);
const wallet = new ethers.Wallet(process.env.ETH_PRIVATE_KEY, provider);

async function generateAddress() {
  // For multi-user setup, derive child wallets (HD Wallet)
  return wallet.address;
}

async function checkDeposit(address:string, expectedAmount:string) {
// Check for incoming txs to address using etherscan API or RPC
  return true;
}

async function sendToken(to:string, amount:string, tokenAddress = null) {
  if (tokenAddress) {
    // ERC20 transfer
    const abi = [ 'function transfer(address to, uint amount) returns (bool)' ];
    const token = new ethers.Contract(tokenAddress, abi, wallet);
    return await token.transfer(to, amount);
  } else {
    // Native ETH transfer
    return await wallet.sendTransaction({ to, value: ethers.parseEther(amount.toString()) });
  }
}

async function checkEthereumDeposit(address:string, expectedAmount:string) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance) >= expectedAmount;
}