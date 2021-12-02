// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Concord is ERC20, Ownable {

    event ProposalExecuted(address indexed beneficiary, uint indexed amount, string indexed reason);

    struct Member {
		address addr;
		uint bal;
    }
	Member[] public members;
    
    constructor(address concordBot, address member) ERC20("CC Token", "CC") payable {
        register(member);
        transferOwnership(concordBot);
    }
    
    function register(address _member) public onlyOwner {
        members.push(
			Member({
				addr: _member,
		        bal: 20000000000000000000
			})
		);
        _mint(address(this), 200 * 10 ** 18);
    }
    
    function executeProposal(address beneficiary, uint amount, string memory reason) public payable onlyOwner {
        require(address(this).balance > amount, "Insuficient funds");        
        payable(beneficiary).transfer(amount);
        emit ProposalExecuted(beneficiary, amount, reason);
    }

    receive() external payable {
        _mint(msg.sender, msg.value);
    }
    
    function checkBalance() public view returns (uint) {
        return address(this).balance;
    }

    function checkTokenBalance() public view returns (uint) {
        return balanceOf(address(this));
    }

    function give() public payable returns (string memory) {
        _mint(msg.sender, msg.value);
        return "Thanks!";
    }

    function tip(address tipper, address recipient, uint amount) public payable {
        // we check tipper's bal, 
        // send amount from the contract to recipient, 
        // and update the balances
    }

    function withdraw() public payable {
        // Withdraw MATIC from the treasury and burn the tokens
    }

    function shutDown() public payable {
        // Can be triggered by a member
        // if x % members triggers it within a month, distribute all MATIC to CC holders
    }    
}