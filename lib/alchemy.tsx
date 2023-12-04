const { Network, Alchemy } = require("alchemy-sdk");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
  apiKey: process.env.alchemy_key, // Replace with your Alchemy API Key.
  network: Network.OPT_GOERLI, // Replace with your network.
};

const alchemy = new Alchemy(settings);

export default alchemy;
