// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CC.sol";
import "hardhat/console.sol";

contract KiezDAO {

    address public tokenAddress; // the address of CC token
    
    event Received(address, uint);
    event Spent(address, uint);
    
    constructor(address _tokenAddress) payable {
        tokenAddress = _tokenAddress;
    }

    // Shoot 1 ETH to caller
    function addProposal() public payable {
        require (address(this).balance > 1 wei, "NO_MONEY");
        payable(msg.sender).transfer(1 ether);
        
        CC(tokenAddress).withdraw(msg.sender); // CC tokens are minted and transfered to msg.sender
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