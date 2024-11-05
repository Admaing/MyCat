//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author UFO
 */
contract MyCatContract is ERC721URIStorage,Ownable {
    uint256 public catCounter;
    IERC20 public nutritionToken;
    uint256 public breedingCostInToken;

    //最大可以铸造的猫咪数量
    uint256 public constant MAX_MINTABLE_CATS = 5;  
    struct Cat {
        uint256 id;
        string name;
        string gender;
        string imageURI;
    }
    struct MarketItem {
        uint256 catId;
        address seller;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => Cat) public cats;
    mapping(address => uint256) public mintedCatsCount;
    // 这玩意不太懂是干嘛的
    mapping(uint256 => MarketItem) public marketItems;

    event CatMinted(uint256 id, string name, string gender, string imageURI, address owner);
    event CatBred(uint256 id, string name, uint256 parent1, uint256 parent2, address owner);
    event CatListed(uint256 catId, uint256 price, address seller);
    event CatDelisted(uint256 catId);
    event CatBought(uint256 catId, address buyer, address seller, uint256 price);

    // 构造函数：初始化营养Token地址和繁殖成本
    constructor(address _nutritionToken, uint256 _breedingCostInToken) ERC721("MyCatNFT", "MCN") Ownable(msg.sender) {
        catCounter = 0;
        nutritionToken = IERC20(_nutritionToken);
        breedingCostInToken = _breedingCostInToken;
    }

    function setBreedingCost(uint256 _breedingCostInToken) public onlyOwner {
        breedingCostInToken = _breedingCostInToken;
    }


    // 铸造新猫咪NFT，只有合约所有者可以调用
    function mintCat(string memory _name, string memory _gender, string memory _imageURI) public {
        require(mintedCatsCount[msg.sender] < MAX_MINTABLE_CATS, "You can only mint up to 5 cats"); // 限制每个用户最多铸造5只猫咪
        catCounter++; // 增加猫咪计数器
        uint256 newCatId = catCounter; // 新猫咪的ID
        _mint(msg.sender, newCatId); // 铸造新的猫咪NFT

        // 创建新的Cat结构体并存储其信息
        Cat memory newCat = Cat({
            id: newCatId,
            name: _name,
            gender: _gender,
            imageURI: _imageURI
        });
        console.log("cat id is  ",newCatId);
        cats[newCatId] = newCat; // 保存猫咪信息
        _setTokenURI(newCatId, _imageURI); // 设置猫咪的URI
        mintedCatsCount[msg.sender]++;


        emit CatMinted(newCatId, _name, _gender, _imageURI, msg.sender);
    }

// 繁殖两只猫咪，使用指定的ERC20 Token支付繁殖费用
    function breedCats(uint256 _catId1, uint256 _catId2, string memory _newCatName, string memory _newCatImageURI) public {
        // 确保调用者拥有这两只猫咪
        require(ownerOf(_catId1) == msg.sender, "You must own the first cat");
        require(ownerOf(_catId2) == msg.sender, "You must own the second cat");
        require(!_sameGender(_catId1, _catId2), "Cats must be of different genders"); // 确保两只猫咪性别不同
        // 转移营养Token用于支付繁殖费用
        console.log("cat id is  ",breedingCostInToken);
         require(nutritionToken.transferFrom(msg.sender, address(this), breedingCostInToken), "Insufficient nutrition tokens for breeding");
        
        catCounter++; // 增加猫咪计数器
        uint256 newCatId = catCounter; // 新猫咪的ID
        _mint(msg.sender, newCatId); // 铸造新猫咪NFT
        console.log("cat id is  ",breedingCostInToken);
        // 创建新的Cat结构体并存储其信息
        Cat memory newCat = Cat({
            id: newCatId,
            name: _newCatName,
            gender: "Unknown", // 性别稍后确定
            imageURI: _newCatImageURI
        });

        cats[newCatId] = newCat; // 保存新猫咪信息
        _setTokenURI(newCatId, _newCatImageURI); // 设置新猫咪的URI

        // 触发猫咪繁殖事件
        emit CatBred(newCatId, _newCatName, _catId1, _catId2, msg.sender);
    }


      // 将猫咪列入市场进行出售
    function listCat(uint256 _catId, uint256 _price) public {
        // 确保调用者拥有这只猫咪
        require(ownerOf(_catId) == msg.sender, "You must own the cat to list it");
        require(_price > 0, "Price must be greater than zero"); // 确保价格大于零

        // 创建市场项目信息
        marketItems[_catId] = MarketItem({
            catId: _catId,
            seller: msg.sender,
            price: _price,
            isListed: true
        });

        // 触发猫咪列入市场事件
        emit CatListed(_catId, _price, msg.sender);
    }

    // 取消列出的市场项目
    function delistCat(uint256 _catId) public {
        // 确保只有卖家可以取消列出
        require(marketItems[_catId].seller == msg.sender, "Only the seller can delist the cat");
        require(marketItems[_catId].isListed, "Cat is not listed");

        marketItems[_catId].isListed = false; // 更新市场项目信息

        // 触发猫咪取消列出事件
        emit CatDelisted(_catId);
    }

    // 购买列出的猫咪
    function buyCat(uint256 _catId) public payable {
        MarketItem memory item = marketItems[_catId]; // 获取市场项目信息

        // 确保猫咪可供出售，并且购买价款正确
        require(item.isListed, "Cat is not for sale");
        require(msg.value == item.price, "Incorrect price sent");

        address seller = item.seller; // 获取卖家地址

        // 转移猫咪所有权
        _transfer(seller, msg.sender, _catId);

        // 将ETH转移到卖家
        (bool success, ) = seller.call{value: msg.value}("");
        require(success, "Transfer failed");

        item.isListed = false; // 更新市场项目信息
        marketItems[_catId] = item; // 保存更新后的市场项目信息

        // 触发猫咪售出事件
        emit CatBought(_catId, msg.sender, seller, msg.value);
    }

    // 内部辅助函数，检查两只猫咪的性别是否相同
    function _sameGender(uint256 _catId1, uint256 _catId2) private view returns (bool) {
        return keccak256(abi.encodePacked(cats[_catId1].gender)) == keccak256(abi.encodePacked(cats[_catId2].gender));
    }
    // 获取特定地址的猫咪ID列表
function getMyCats() public view returns (Cat[] memory) {
    console.log("msg.sender is ",msg.sender);
    uint256 count = mintedCatsCount[msg.sender];
    Cat[] memory myCats = new Cat[](count);
    uint256 index = 0;

    for (uint256 i = 1; i <= catCounter; i++) {
        if (ownerOf(i) == msg.sender) {
            myCats[index] = cats[i]; // 获取猫咪的详细信息
            index++;
        }
    }
    
    return myCats; // 返回猫咪的详细信息
}
}
