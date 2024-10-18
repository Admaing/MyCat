import { ethers } from "hardhat";
import { CatToken, CatToken__factory, MyCatContract, MyCatContract__factory } from "../typechain-types";

async function main() {
  // 获取签名器（默认账户）
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 tokens

  // 部署 CatToken 合约
  const CatTokenFactory: CatToken__factory = await ethers.getContractFactory("CatToken");
  const nutritionToken: CatToken = await CatTokenFactory.deploy("CatToken", "NT", initialSupply);
  await nutritionToken.waitForDeployment();
  console.log("CatToken deployed to:", nutritionToken.target);

  // 部署 MyCatMarketContract 合约
  const MyCatMarketContractFactory: MyCatContract__factory = await ethers.getContractFactory("MyCatContract");
  const myCatMarketContract: MyCatContract = await MyCatMarketContractFactory.deploy(
    nutritionToken.target,
    ethers.parseUnits("10", 18),
  );
  await myCatMarketContract.waitForDeployment();
  console.log("MyCatMarketContract deployed to:", myCatMarketContract.target);
}

// 运行部署脚本
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
export default main;
