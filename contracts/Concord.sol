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

    // Map Discord ID to a User object
    mapping(uint256 => User) private users;

    // Map address to Discord ID for front-end usage
    mapping(address => uint256) public userId;

    /// @dev First member gets member id "1"
    /// @param _bot Discord bot's address
    /// @param _name Name of the ERC-20 token
    /// @param _symbol Symbol of the ERC-20 token
    /// @param _welcome Amount of tokens to transfer to a newly registerd member
    constructor(
        address _bot,
        string memory _name, 
        string memory _symbol, 
        uint256 _welcome
    )
        ERC20(_name, _symbol) payable {
        welcome = _welcome;
        transferOwnership(_bot);
    }

    /// @dev Registers a member (i.e. a voting user) 
    /// @param _discordId New user's numeric discord ID
    /// @param _address New user's address
    function registerMember(uint256 _discordId, address _address) public onlyOwner {
        // Revert if address is already registered with another user
        if (userId[_address] == 0) {

            // Existing user --> Update address
            if (users[_discordId].addr != address(0x0)) {
                userId[users[_discordId].addr] = 0;
                users[_discordId].addr = _address;
                userId[_address] = _discordId;

            // First time user? --> Award welcome tokens
            } else {
                users[_discordId] = User({
                    addr: _address,
                    bal: welcome,
                    member: true
                });

                userId[_address] = _discordId;

                _mint(address(this), welcome);
            }
        } else {
            revert("Address is already registered");
        }
    }
    
    /// @notice Sends funds from the contract to the beneficiary
    /// @dev This function can only be triggered by the Discord bot
    /// @param _beneficiary The recipient address
    /// @param _amount Amount of ETH to send from the treasury to the beneficiary
    /// @param _reason Jusification for this expanse
    function executeProposal(uint256 _beneficiary, uint256 _amount, string memory _reason) public payable onlyOwner {
        require(address(this).balance > _amount, "Insuficient funds");
        address beneficiaryAddress = users[_beneficiary].addr;    
        payable(beneficiaryAddress).transfer(_amount);
        emit ProposalExecuted(beneficiaryAddress, _amount, _reason);
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

    /// @notice A registered user sends tokens to the contract
    /// @param _amount Amount to credit
    function topup(uint _amount) public {
        require(balanceOf(msg.sender) >= _amount, "Not enough tokens");
        require(getUserId(msg.sender) != 0, "Must register");
        users[getUserId(msg.sender)].bal += _amount;
        transfer(address(this),_amount);
    }

    /// @notice Transfers tokens from contract to user and debit user account
    /// @dev This function can only be triggered by the Discord bot
    /// @param _id Discord ID
    /// @param _amount Amount to debit
    function withdraw(uint256 _id, uint256 _amount) public payable onlyOwner {
        require(users[_id].bal > _amount, "Not enough tokens");
        users[_id].bal -= _amount;
        _transfer(address(this), users[_id].addr, _amount);
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

    /// @notice Returns user's in-app balance 
    /// @param _userAddress User address
    function getAccountBalance(address _userAddress) public view returns(uint256) {
        return users[getUserId(_userAddress)].bal;
    }

    function getAddressFromId(uint256 _userId) public view onlyOwner returns(address) {
      return users[_userId].addr;
    }
}