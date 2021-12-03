// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Concord is ERC20, Ownable {

    event ProposalExecuted(address indexed beneficiary, uint indexed amount, string indexed reason);
    event Claimed(address indexed beneficiary, uint indexed amount, string indexed task);

    struct User {
		address addr;
		uint bal;
        bool member;
    }
	User[] public users;
    
    constructor(address bot, address _member) ERC20("CC Token", "CC") payable {
        register(_member);
        transferOwnership(bot);
    }

    // constructor() ERC20("CC Token", "CC") payable {
    //     register(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2);
    //     transferOwnership(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4);
    // }
    
    function register(address _member) public onlyOwner {
        users.push(
			User({
				addr: _member,
		        bal: 200 * 10**18,
                member: true
			})
		);
        _mint(address(this), 200 * 10**18);
    }
    
    function executeProposal(address beneficiary, uint amount, string memory reason) public payable onlyOwner {
        require(address(this).balance > amount, "Insuficient funds");        
        payable(beneficiary).transfer(amount);
        emit ProposalExecuted(beneficiary, amount, reason);
    }

    function claim(address beneficiary, uint amount, string memory task) public payable onlyOwner {
        _mint(beneficiary, amount);
        emit Claimed(beneficiary, amount, task);
    }

    receive() external payable {
        give();
    }

    function give() public payable {
        _mint(msg.sender, msg.value);
    }

    function tip(uint tipper, uint recipient, uint amount) public onlyOwner {
        require(users[tipper].bal > amount, "Can't tip"); // can also be done off-chain
        users[tipper].bal = users[tipper].bal - amount;
        users[recipient].bal = users[recipient].bal + amount;
    }

    function topup(uint _id, address _user, uint _amount) public onlyOwner {
        users.push(
            User({
                addr: _user,
                bal: 0,
                member: false
            })
        );
		users[_id].bal += _amount;
        _transfer(address(this),_user,_amount);
    }

    function withdraw(uint _id, uint _amount) public payable onlyOwner {
        users[_id].bal -= _amount;
        _transfer(address(this),users[_id].addr,_amount);
    }

    // TO FIX
    function rageQuit(uint amount) public payable {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount / totalSupply() * address(this).balance - 1 ); // "panic code 0x11" :)
    }

    // TO DO
    function shutDown() public payable returns (string memory) {
        // checks if msg.sender is a member
        // if x % of the members trigger it within a month, 
        // distribute all MATIC to CC holders
        // and revoke ownership
        return "Game over";
    }    

    function checkBalance() public view returns (uint) {
        return address(this).balance;
    }

    function checkTokenBalance() public view returns (uint) {
        return balanceOf(address(this));
    }
}