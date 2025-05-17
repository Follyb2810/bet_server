import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";

const OSMOSIS_RPC = "https://rpc.osmosis.zone";
const CW20_CONTRACT = "osmo1contractaddresshere";

async function checkCW20Balance(walletAddress:string) {
  const client = await SigningCosmWasmClient.connect(OSMOSIS_RPC);

  const balance = await client.queryContractSmart(CW20_CONTRACT, {
    balance: { address: walletAddress },
  });

  console.log(`Balance: ${balance.amount}`);
}

checkCW20Balance("osmo1YourWalletAddress");


const fetch = require("node-fetch");

const AXELAR_API = "https://axelarscan.io/api/v1/assets";

async function getAxelarRoutes() {
  const response = await fetch(AXELAR_API);
  const data = await response.json();
  console.log(data);
}

// Example Usage
getAxelarRoutes();