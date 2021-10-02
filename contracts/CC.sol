// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CC is ERC20 {
    
    event Withdrawn(address indexed user, uint indexed amount );
    
    constructor() ERC20("Magic CC for hackers", "CC") {
        // _mint(msg.sender, 1000000*10**18);
    }
    
    // mints 50 units on the fly
    function withdraw(address _beneficiary) public {
        _mint(_beneficiary, 50*10**18);
        emit Withdrawn (_beneficiary, 50);
    }
}