import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployCatToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // 部署 CatToken 合约
  const catToken = await deploy("CatToken", {
    from: deployer,
    args: ["CatToken", "CAT", hre.ethers.parseUnits("1000")], // 传递初始 Token 参数
    log: true,
    autoMine: true,
  });

  console.log("CatToken deployed at:", catToken.address);

  // 部署 MyCatContract 合约
  const breedingCostInToken = hre.ethers.parseUnits("10"); // 设置繁殖费用，例如10个 CAT token
  const myCatContract = await deploy("MyCatContract", {
    from: deployer,
    args: [catToken.address, breedingCostInToken], // 传递 CatToken 地址和繁殖费用
    log: true,
    autoMine: true,
  });

  console.log("MyCatContract deployed at:", myCatContract.address);
};

export default deployCatToken;
deployCatToken.tags = ["CatToken", "MyCatContract"];
