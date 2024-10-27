const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyCatMarketContract", function () {
  let MyCatMarketContract;
  let myCatMarketContract;
  let owner;
  let addr1;
  let addr2;
  let nutritionToken;
  const initialSupply = ethers.parseUnits("1000000", 18); // 1,000,000 tokens

  beforeEach(async function () {
    // 部署营养Token合约
    const NutritionToken = await ethers.getContractFactory("CatToken");
    nutritionToken = await NutritionToken.deploy("CatToken", "NT", initialSupply);
    await nutritionToken.waitForDeployment();
    
    // 分发营养Token
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    await nutritionToken.transfer(addr1.address, ethers.parseUnits("1000", 18));
    await nutritionToken.transfer(addr2.address, ethers.parseUnits("1000", 18));

    // 部署猫咪合约
    MyCatMarketContract = await ethers.getContractFactory("MyCatContract");
    console.log("owner test",nutritionToken.target);
    //部署后的合约地址使用address取出
    myCatMarketContract = await MyCatMarketContract.deploy(nutritionToken.target, ethers.parseUnits("10", 18));
    await myCatMarketContract.waitForDeployment();
  });

  it("应该成功铸造新的猫咪NFT", async function () {
    
    await myCatMarketContract.connect(owner).mintCat("Cat1", "Male", "ipfs://cat1");
    const catDetails = await myCatMarketContract.cats(1);
    expect(catDetails.name).to.equal("Cat1");
    expect(catDetails.gender).to.equal("Male");
    expect(catDetails.imageURI).to.equal("ipfs://cat1");
  });

  it("应该限制每个用户最多铸造5只猫咪", async function () {
    for (let i = 1; i <= 5; i++) {
      await myCatMarketContract.connect(addr1).mintCat(`Cat${i}`, "Female", `ipfs://cat${i}`);
    }
    console.log("target",addr1.target)
    console.log("我的猫咪有", await myCatMarketContract.connect(addr1).getMyCats());
    // 尝试铸造第6只猫咪
    await expect(myCatMarketContract.connect(addr1).mintCat("Cat6", "Female", "ipfs://cat6"))
      .to.be.revertedWith("You can only mint up to 5 cats");
  });

  it("should allow user to mint a new cat and retrieve their cat list", async function () {
    // 使用 owner 铸造新的猫咪
    // for (let i = 1; i <= 5; i++) {
      const specificSigner = await ethers.getSigner("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199");

      // await myCatMarketContract.connect(specificSigner).mintCat("Whiskers", "Male", "ipfs://cat1");
      
      // await myCatMarketContract.connect(addr1).mintCat(`Cat${i}`, "Female", `ipfs://cat${i}`);
    // }
    await myCatMarketContract.connect(specificSigner).mintCat(`Whiskers`,"Male",`ipfs://cat1`);
    // const myCats = await myCatMarketContract.connect("0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199").callStatic.getMyCats();
    // 获取 owner 铸造的猫咪列表
    const myCats = await myCatMarketContract.connect(specificSigner).getMyCats();
    const catDetails = await myCatMarketContract.cats(1);
    console.log(myCats)
    // // 检查列表中是否包含了铸造的猫咪ID
    // expect(myCats.length).to.equal(1);
    // expect(myCats[0]).to.equal(1); // 第一个猫咪ID应该是 1
  });

  it("应该成功使用营养Token繁殖猫咪", async function () {
    await myCatMarketContract.connect(owner).mintCat("Cat1", "Male", "ipfs://cat1");
    await myCatMarketContract.connect(owner).mintCat("Cat2", "Female", "ipfs://cat2");
    
    // 授权合约消费营养Token
    await nutritionToken.connect(owner).approve(myCatMarketContract.target, ethers.parseUnits("10", 18));
    
    await myCatMarketContract.connect(owner).breedCats(1, 2, "NewCat", "ipfs://newcat");
    const newCatDetails = await myCatMarketContract.cats(3);
    expect(newCatDetails.name).to.equal("NewCat");
    expect(newCatDetails.imageURI).to.equal("ipfs://newcat");
  });

  it("应该正确列出、取消和购买猫咪", async function () {
    await myCatMarketContract.connect(owner).mintCat("Cat1", "Male", "ipfs://cat1");
    
    // 列出猫咪
    await myCatMarketContract.connect(owner).listCat(1, ethers.parseUnits("1", 18));
    const listedCat = await myCatMarketContract.marketItems(1);
    expect(listedCat.isListed).to.be.true;

    // 取消列出
    await myCatMarketContract.connect(owner).delistCat(1);
    const delistedCat = await myCatMarketContract.marketItems(1);
    expect(delistedCat.isListed).to.be.false;

    // 重新列出并购买
    await myCatMarketContract.connect(owner).listCat(1, ethers.parseUnits("1", 18));
    await myCatMarketContract.connect(addr1).buyCat(1, { value: ethers.parseUnits("1", 18) });
    const boughtCat = await myCatMarketContract.ownerOf(1);
    expect(boughtCat).to.equal(addr1.address);
  });
});