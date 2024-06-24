import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import dotenv from "dotenv";

if (!process.env.DEPLOYER_KEY || process.env.DEPLOYER_KEY === "") {
  dotenv.config({ path: "./.env" });
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [process.env.DEPLOYER_KEY || ``],
      gas: 99999999,
    },
  },
};

export default config;
