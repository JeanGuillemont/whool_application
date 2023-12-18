const { Network, Alchemy } = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY, // Replace with your Alchemy API Key.
  network: Network.OPT_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export default alchemy;
