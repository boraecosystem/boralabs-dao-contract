import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = deployer.address;
  console.log("Deployer: ", deployerAddress);
  // Step1. Deploy Bold Token
  const bold = await ethers.deployContract("BoraLabsDaoToken", []);
  await bold.waitForDeployment();

  const boldContract = await bold.getAddress();

  console.log("VOTE deployed: ", boldContract);

  // Step2. Deploy Governor Contract
  const governor = await ethers.deployContract("BoraLabsGovernor", [
    boldContract,
  ]);
  await governor.waitForDeployment();
  const governorContract = await governor.getAddress();

  console.log("Governor deployed: ", governorContract);

  // Step3. Deploy Service Token Contract
  const serviceToken = await ethers.deployContract("ServiceToken", []);
  await serviceToken.waitForDeployment();
  const serviceTokenContract = await serviceToken.getAddress();

  console.log("ServiceToken deployed: ", serviceTokenContract);

  // Step4. Deploy multicall Contract
  const multicall3 = await ethers.deployContract("Multicall3");
  await multicall3.waitForDeployment();

  const multicall3Contract = await multicall3.getAddress();
  console.log("Multicall3 deployed: ", multicall3Contract);
  console.log("DONE!");

  const currentScriptPath = __filename;
  const repository = path.dirname(path.dirname(currentScriptPath));

  var envFile = "";
  envFile = `
# DAO API
VITE_DAO_API_URL=localhost:3000

# CHAIN INFO
VITE_DAO_CHAIN_ID=1337
VITE_DAO_CHAIN_NAME=Ganache
VITE_DAO_RPC_URL=http://127.0.0.1:7545
VITE_DAO_EXPLORER_URL=

# CONTRACT INFO
VITE_DAO_VOTE_TOKEN=${boldContract}
VITE_DAO_PLUS_TOKEN=${serviceTokenContract}
VITE_DAO_GOVERNANCE=${governorContract}
VITE_DAO_MULTI_CALL3=${multicall3Contract}
  `;

  fs.writeFileSync(repository + "/.env", envFile);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
