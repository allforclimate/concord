// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CC.sol";
import "hardhat/console.sol";

contract KiezDAO {

    address public tokenAddress; // the address of CC token
    bool public set; // Returns true when CC token contract address is set
    
    event Received(address, uint);
    event Spent(address, uint);
    
    constructor() payable {}
    
    function setTokenAddress(address _tokenAddress) public {
        require(set == false, "TOKEN_ADDRESS_ALREADY_SET");
        tokenAddress = _tokenAddress;
        set = true;
    }

    // Shoot 1 ETH and 200 CC to caller
    function addProposal() public payable {
        require (address(this).balance > 1 wei, "NO_MONEY");
        payable(msg.sender).transfer(10000000000000000 wei);
        uint256 amount = 200; // 200 CC
        CC(tokenAddress).withdraw(msg.sender, amount); // CC tokens are minted and transfered to msg.sender
        emit Spent(msg.sender, msg.value);
    }

    // Donors just donate
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }
    
    // for tests
    function checkBalance() public view returns(uint256){
        return address(this).balance;
    }
}