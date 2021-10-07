// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract CC is ERC20 {
    
    address public kiezDAO;
    
    event Withdrawn(address indexed user, uint indexed amount);
    
    constructor(address _kiezDAO) ERC20("CC Token", "CC") {
        kiezDAO = _kiezDAO;
    }
    
    mapping(address => bool) public memberRegistered;
	address[] public membersList;
    
    // triggered from the DAO contract
    function withdraw(address _beneficiary, uint256 _amount) public {
        require(msg.sender == kiezDAO, "CANNOT_MINT");
        _mint(_beneficiary, _amount*10**18);
        emit Withdrawn (_beneficiary, 50);
        }
    
    // msg.sender gets 1000 units for free // Subject to Sybil attacks
    function register() public {
        if (!memberRegistered[msg.sender]) {
			memberRegistered[msg.sender] = true;
			membersList.push(msg.sender);
			_mint(msg.sender, 1000*10**18);
            emit Withdrawn (msg.sender, 1000);
		} else {
		    revert("ALREADY_REGISTERED");
		}
    }
}