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

    /// @dev First member gets member id "1"
    /// @param _bot Discord bot's address
    /// @param _member First member's address
    /// @param _name Name of the ERC-20 token
    /// @param _symbol Symbol of the ERC-20 token
    /// @param _welcome Amount of tokens to transfer to a newly registerd member
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
                addr: 0x0000000000000000000000000000000000000000,
		        bal: 0,
		        member: false
	        })
	    );
        registerMember(_member);
        transferOwnership(_bot);
    }
    
    /// @dev Registers a non-voting user 
    /// @param _user New user's address
    function registerUser(address _user) public onlyOwner {
        users.push(
	        User({
                addr: _user,
		        bal: 0,
		        member: false
	        })
	    );
        userId[_user] = users.length - 1;
    }

    /// @dev Registers a member (i.e. a voting user) 
    /// @param _member New member's address
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
    
    /// @notice Sends funds from the contract to the beneficiary
    /// @dev This function can only be triggered by the Discord bot
    /// @param _beneficiary The recipient address
    /// @param _amount Amount of ETH to send from the treasury to the beneficiary
    /// @param _reason Jusification for this expanse
    function executeProposal(address _beneficiary, uint256 _amount, string memory _reason) public payable onlyOwner {
        require(address(this).balance > _amount, "Insuficient funds");        
        payable(_beneficiary).transfer(_amount);
        emit ProposalExecuted(_beneficiary, _amount, _reason);
    }

    /// @notice Mints fresh tokens and credit the member's account 
    /// @dev This function can only be triggered by the Discord bot
    /// @param _beneficiary The account to credit
    /// @param _amount Amount of tokens to send from the treasury to the beneficiary
    /// @param _task Jusification for this expanse
    function claimTask(uint256 _beneficiary, uint256 _amount, string memory _task) public payable onlyOwner {
        _mint(address(this), _amount);
        users[_beneficiary].bal += _amount;
        emit Claimed(_beneficiary, _amount, _task);
    }

    /// @notice Triggers the give() function when funds are directly sent to the contract 
    receive() external payable {
        give();
    }

    /// @notice Mints and transfers fresh tokens to caller
    function give() public payable {
        _mint(msg.sender, msg.value);
    }

    /// @notice transfers amount from sender to recipient in non-withdrawn funds 
    /// @dev This function can only be triggered by the Discord bot
    /// @param _sender The account to debit
    /// @param _recipient The account to credit
    /// @param _amount The of the tip
    function tip(uint256 _sender, uint256 _recipient, uint256 _amount) public onlyOwner {
        require(users[_sender].bal > _amount, "Can't tip");
        users[_sender].bal = users[_sender].bal - _amount;
        users[_recipient].bal = users[_recipient].bal + _amount;
    }

    /// @notice Transfers tokens from user to contract and credit his user account 
    /// @dev This function can only be triggered by the Discord bot
    /// @param _amount Amount to credit
    function topup(uint _amount) public {
        require(balanceOf(msg.sender) > _amount, "Not enough tokens");
        require(getUserId(msg.sender) != 0, "Must register");
        users[getUserId(msg.sender)].bal += _amount;
        transfer(address(this),_amount);
    }

    /// @notice Transfers tokens from contract to user and debit user account
    /// @dev This function can only be triggered by the Discord bot
    /// @param _id Account ID
    /// @param _amount Amount to debit
    function withdraw(uint256 _id, uint256 _amount) public payable onlyOwner {
        require(users[_id].bal > _amount, "Not enough tokens");
        users[_id].bal -= _amount;
        _transfer(address(this),users[_id].addr,_amount);
    }

    /// @notice Transfers ETH from contract to caller
    /// @notice Calculation details: https://github.com/AllForClimate/concord/wiki#cashing-out 
    /// @dev This function can be called from the frontend
    /// @param _amount Amount of tokens sent by user
    function rageQuit(uint _amount) public payable {
        require(balanceOf(msg.sender) >= _amount, "Too high");
        _burn(msg.sender, _amount);
        uint256 ethBal = address(this).balance;
        uint256 supply = totalSupply();
        uint256 x = ethBal.div(supply);        
        payable(msg.sender).transfer(x.mul(_amount));
    }

    /// @notice Returns the amount of tokens held in the contract
    function checkTokenBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }

    /// @notice Returns user ID 
    /// @param _userAddress User address
    function getUserId(address _userAddress) public view returns(uint256) {        
        return userId[_userAddress];
    }

    /// @notice Returns user account balance 
    /// @param _userAddress User address
    function getAccountBalance(address _userAddress) public view returns(uint256) {
        return users[getUserId(_userAddress)].bal;
    }
}