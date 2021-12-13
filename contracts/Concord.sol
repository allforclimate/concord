// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

contract Concord is ERC20, Ownable {

    using PRBMathUD60x18 for uint256;
    
    event ProposalExecuted(address indexed beneficiary, uint256 indexed amount, string indexed reason);
    event Claimed(uint256 indexed beneficiary, uint256 indexed amount, string indexed task);

    uint256 public welcome;

    struct User {
    	address addr;
	    uint256 bal;
        bool member; // returns true when user is a member (i.e. a voting user)
    }
    User[] public users;
    mapping(address => uint256) public userId;
    
    /// @param _bot Discord bot's address
    /// @param _member first member's address
    /// @param _name name of the ERC-20 token
    /// @param _symbol symbol of the ERC-20 token
    /// @param _welcome amount of tokens to transfer to a newly registerd member
    
    constructor(
        address _bot, 
        address _member,
        string memory _name, 
        string memory _symbol, 
        uint256 _welcome
    )
        ERC20(_name, _symbol) payable {
        welcome = _welcome;
        users.push(
	        User({
                addr: _member,
		        bal: welcome,
		        member: true
	        })
	    );
        _mint(address(this), welcome);
        transferOwnership(_bot);
    }
    
    function registerUser(address _member) public onlyOwner {
        users.push(
	        User({
                addr: _member,
		        bal: 0,
		        member: false
	        })
	    );
        userId[_member] = users.length - 1;
    }

    function registerMember(address _member) public onlyOwner {
        users.push(
	        User({
                addr: _member,
		        bal: welcome,
		        member: true
	        })
	    );
        _mint(address(this), welcome);
        userId[_member] = users.length - 1;
    }
    
    function executeProposal(address beneficiary, uint256 amount, string memory reason) public payable onlyOwner {
        require(address(this).balance > amount, "Insuficient funds");        
        payable(beneficiary).transfer(amount);
        emit ProposalExecuted(beneficiary, amount, reason);
    }

    function claimTask(uint256 beneficiary, uint256 amount, string memory task) public payable onlyOwner {
        _mint(address(this), amount);
        users[beneficiary].bal += amount;
        emit Claimed(beneficiary, amount, task);
    }

    receive() external payable {
        give();
    }

    function give() public payable {
        _mint(msg.sender, msg.value);
    }

    function tip(uint256 tipper, uint256 recipient, uint256 amount) public onlyOwner {
        require(users[tipper].bal > amount, "Can't tip");
        users[tipper].bal = users[tipper].bal - amount;
        users[recipient].bal = users[recipient].bal + amount;
    }

    function topup(uint256 _id, address _user, uint _amount) public onlyOwner {
        require(balanceOf(_user) > _amount, "Not enough tokens");
        users[_id].bal += _amount;
        _transfer(address(this),_user,_amount);
    }

    function withdraw(uint256 _id, uint256 _amount) public payable onlyOwner {
        require(users[_id].bal > _amount, "Not enough tokens");
        users[_id].bal -= _amount;
        _transfer(address(this),users[_id].addr,_amount);
    }

    function rageQuit(uint amount) public payable {
        require(balanceOf(msg.sender) >= amount, "Too high");
        _burn(msg.sender, amount);
        uint256 ethBal = address(this).balance;
        uint256 supply = totalSupply();
        uint256 x = ethBal.div(supply);        
        payable(msg.sender).transfer(x.mul(amount));
    }

    function checkTokenBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }

    function getUserId(address _userAddress) public view returns(uint256) {        
        return userId[_userAddress];
    }

    function getInContractBalance(address _userAddress) public view returns(uint256) {
        return users[getUserId(_userAddress)].bal;
    }
}