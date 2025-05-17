
const fetch = require("node-fetch");

const AXELAR_API = "https://axelarscan.io/api/v1/assets";

async function getAxelarRoutes() {
  const response = await fetch(AXELAR_API);
  const data = await response.json();
  console.log(data);
}

// Example Usage
// getAxelarRoutes();

// - *Axelar* (best for Cosmos & EVM chains)  
// - *Wormhole* (best for Solana & Ethereum-based chains)  
// - *LayerZero* (best for multi-chain transfers) 