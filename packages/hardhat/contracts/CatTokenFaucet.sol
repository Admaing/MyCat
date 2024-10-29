// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CatToken.sol";  // Import CatToken合约

contract CatTokenFaucet is Ownable {
    CatToken public token;
    uint256 public faucetAmount;
    mapping(address => uint256)  public lastRequestTime;

    constructor(address tokenAddress, uint256 amount) Ownable(msg.sender) {
        token = CatToken(tokenAddress);
        faucetAmount = amount;
    }

    function setFaucetAmount(uint256 amount) public onlyOwner {
        faucetAmount = amount;
    }

    // 领取CatToken，每次只能领取一次；可以自定义间隔时间（例如，每24小时领取一次）
    function requestTokens() public {
        require(block.timestamp - lastRequestTime[msg.sender] >= 1 days, "You can only request tokens once every 24 hours");
        require(token.balanceOf(address(this)) >= faucetAmount, "Faucet has insufficient tokens");

        // 更新领取时间
        lastRequestTime[msg.sender] = block.timestamp;
        
        // 发送token
        token.mint(msg.sender, faucetAmount);
    }

    // 允许合约所有者从水龙头里取款,避免余额过高被意外耗尽
    function withdrawTokens(uint256 amount) public onlyOwner {
        require(token.balanceOf(address(this)) >= amount, "Insufficient tokens in the faucet");
        token.transfer(msg.sender, amount);
    }

    // 允许用户将代币注入到水龙头
    function fund(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
    }
}