import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployCatToken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deploy } = hre.deployments;

  // 部署 CatToken 合约
  const catToken = await deploy("CatToken", {
    from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    args: ["CatToken", "CAT", hre.ethers.parseUnits("100000000")], // 传递初始 Token 参数
    log: true,
    autoMine: true,
  });

  console.log("CatToken deployed at:", catToken.address);
  // console.log("CatToken deployed at111:", catToken.dress);

  // const faucetAmount = hre.ethers.parseUnits("10", 18); // 设置水龙头每次领取的 Token 数量，例如10个 CAT token
  // const catTokenFaucet = await deploy("CatTokenFaucet", {
  //   from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
  //   args: [catToken.address, faucetAmount], // 传递 CatToken 地址和每次发放数量
  //   log: true,
  //   autoMine: true,
  // });

  // console.log("CatTokenFaucet deployed at:", catTokenFaucet.address);

  // 部署 MyCatContract 合约
  // const breedingCostInToken = hre.ethers.parseUnits("1"); // 设置繁殖费用，例如10个 CAT token
  const myCatContract = await deploy("MyCatContract", {
    from: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    args: [catToken.address, 100], // 传递 CatToken 地址和繁殖费用
    log: true,
    autoMine: true,
  });

  console.log("MyCatContract deployed at:", myCatContract.address);
};

export default deployCatToken;
deployCatToken.tags = ["CatToken", "MyCatContract", "CatTokenFaucet"];
