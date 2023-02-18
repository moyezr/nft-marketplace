require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({path : ".env"});
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337
    },
    goerli: {
      url: process.env.ALCHEMY_URL,
      accounts: [ process.env.PRIVATE_KEY ]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};