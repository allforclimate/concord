const logger = require("./Logger.js");
const config = require("../config.js");
const { settings } = require("./settings.js");
const fs = require('fs');
const { ethers } = require("ethers");
const { registeredUsers } = require("./tables.js");
// const addresses = require('../bot/contract/concordAddress.js');


// Let's start by getting some useful functions that we'll use throughout
// the bot, like logs and elevation features.

/*
  PERMISSION LEVEL FUNCTION

  This is a very basic permission system for commands which uses "levels"
  "spaces" are intentionally left black so you can add them if you want.
  NEVER GIVE ANYONE BUT OWNER THE LEVEL 10! By default this can run any
  command including the VERY DANGEROUS `eval` and `exec` commands!

  */
function permlevel(message) {
  let permlvl = 0;

  const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);

  while (permOrder.length) {
    const currentLevel = permOrder.shift();
    if (message.guild && currentLevel.guildOnly) continue;
    if (currentLevel.check(message)) {
      permlvl = currentLevel.level;
      break;
    }
  }
  return permlvl;
}

/*
  GUILD SETTINGS FUNCTION

  This function merges the default settings (from config.defaultSettings) with any
  guild override you might have for particular guild. If no overrides are present,
  the default settings are used.

*/
  
// getSettings merges the client defaults with the guild settings. guild settings in
// enmap should only have *unique* overrides that are different from defaults.
function getSettings(guild) {
  settings.ensure("default", config.defaultSettings);
  if (!guild) return settings.get("default");
  const guildConf = settings.get(guild.id) || {};
  // This "..." thing is the "Spread Operator". It's awesome!
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  return ({...settings.get("default"), ...guildConf});
}

/*
  SINGLE-LINE AWAIT MESSAGE

  A simple way to grab a single reply, from the user that initiated
  the command. Useful to get "precisions" on certain things...

  USAGE

  const response = await awaitReply(msg, "Favourite Color?");
  msg.reply(`Oh, I really love ${response} too!`);

*/
async function awaitReply(msg, question, limit = 60000) {
  const filter = m => m.author.id === msg.author.id;
  await msg.channel.send(question);
  try {
    const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
    return collected.first().content;
  } catch (e) {
    return false;
  }
}

/* MISCELLANEOUS NON-CRITICAL FUNCTIONS */
  
// toProperCase(String) returns a proper-cased string such as: 
// toProperCase("Mary had a little lamb") returns "Mary Had A Little Lamb"
function toProperCase(string) {
  return string.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

// getTodayString() returns today's date (yyyymmdd) as a string with no hyphens in between
// Example: 20211006 would be returned if the function were run on 2021-10-06
function getTodayString() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0');
  let yyyy = String(today.getFullYear());

  return yyyy + mm + dd;
};

async function loadContract() {

  // load wallet and provider
  let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC); 
  const provider = getInfuraProvider();
  wallet = wallet.connect(provider);   

  // load contract
  const abiFile = fs.readFileSync('modules/concordAbi.json');
  const abi = JSON.parse(abiFile);
  const addressRaw = fs.readFileSync('modules/concordAddress.json');
  const addr = JSON.parse(addressRaw);
  const concord = new ethers.Contract(addr.concord, abi, wallet);

  return concord;
}
    
// getInfuraProvider() returns a ethers.Provider object connected to Infura using the
// API key stored in the environment variable
function getInfuraProvider() {
    const apiKey = {
        projectId: process.env.INFURA_PROJECT_ID,
        projectSecret: process.env.INFURA_PROJECT_SECRET
    };
    const provider = new ethers.providers.InfuraProvider(network=process.env.NETWORK, apiKey);
    return provider;
}

// Returns user's in-contract token balance (i.e. 'account balance')
async function getAccountBalance(userAddress) {
  
  const concord = await loadContract();
  userAddress = ethers.utils.getAddress(userAddress);

  let balance = await concord.getInContractBalance(userAddress);
  accountBalance = ethers.utils.formatEther(balance);
  console.log("bal: ", balance.toString());

  return accountBalance;

};

// Returns user's wallet token balance
async function getWalletBalance(userAddress) {
  
  const concord = await loadContract();
  userAddress = ethers.utils.getAddress(userAddress);
  let balance = await concord.balanceOf(userAddress);
  walletBalance = ethers.utils.formatEther(balance);
  console.log("bal: ", balance.toString());

  return walletBalance;
};

// isRegistered(String) checks it he user has registered their wallet
function isRegistered(userId) {
    return registeredUsers.indexes.includes(userId);
};

// canVote(String) checks if the user is registered and has enough coins in wallet to be able to vote
async function canVote(userId) {
    if (isRegistered(userId)) {
        const userAddress = registeredUsers.get(userId);
        const balance = await getTokenBalance(userAddress);
        return balance > 0.0000001;
    } else {
        return false;
    }
};

// submitProposal(string, bool) ensures that votes from Discord are placed on-chain by submitting
// the proposal to the Reality module.

function submitProposal(proposalId, outcome) {

    // Load provider and bot wallet
    const provider = getInfuraProvider();
    let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    wallet = wallet.connect(provider);
    const realityContract = new ethers.Contract()

    return false;
}

async function isMember(address) {
  //address = "0x961fF506d6516633056c57315bE10a12fa449Ebc";
  const concord = await loadContract();
  const call = await concord.getUserId(address);

  if (call == 0) {
    return false;
  } else {
    return true;
  }

}

async function isRegisteredUser(userId) {
  
  // returns true if user ID is not 0
  
}

async function getContractBalance() {
  
  try {

    // load wallet and provider
    let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC); 
    const provider = getInfuraProvider();
    wallet = wallet.connect(provider);   

    const addressRaw = fs.readFileSync('modules/concordAddress.json');
    const addr = JSON.parse(addressRaw);

    const constractBalanceRaw = await provider.getBalance(addr.concord);
    const constractBalance = constractBalanceRaw.toString();
    console.log("constractBalance: ", constractBalance);
    return constractBalance;

  } catch (err) {
    console.error(err);
  }
}

// triggers claim() 
async function concordClaim(address, amount, proposal) {
  try {
    const concord = await loadContract();

    amount = ethers.utils.parseEther(amount);

    console.log("address: ", address);
    console.log("amount: ", amount.toString());
    console.log("proposal: ", proposal);

    const id = await concord.getUserId(address);

    const call = await concord.claimTask(id, amount, proposal);    

    // do we want to wait until the transaction is mined?
    txHash = call.hash;
    console.log("txHash: ", txHash);
    return txHash

  } catch (err) {
    console.error(err);
  }
};

// triggers executeProposal() 
async function concordPropose(address, amount, proposal) {
  try {
    const concord = await loadContract();

    amount = ethers.utils.parseEther(amount);
    const call = await concord.executeProposal(address, amount, proposal);    

    // do we want to wait until the transaction is mined?
    txHash = call.hash;
    console.log("txHash: ", txHash);
    return txHash

  } catch (err) {
    console.error(err);
  }
};

async function concordTip(from, to, amount) {
  try {

    const concord = await loadContract();

    amount = ethers.utils.parseEther(amount);

    const senderId = await concord.getUserId(from);
    const recipientId = await concord.getUserId(to);

    console.log("from: ", senderId);
    console.log("to: ", to);
    console.log("amount: ", amount.toString());
    
    const call = await concord.tip(senderId, recipientId, amount);    

    // do we want to wait until the transaction is mined?
    txHash = call.hash;
    console.log("txHash: ", txHash);
    return txHash

  } catch (err) {
    console.error(err);
  }
};

async function concordWithdraw(to, amount) {
  try {

    const concord = await loadContract();

    amount = ethers.utils.parseEther(amount);
    const recipientId = await concord.getUserId(to);

    console.log("to: ", to);
    console.log("amount: ", amount.toString());
    
    const call = await concord.withdraw(recipientId, amount);    

    // do we want to wait until the transaction is mined?
    txHash = call.hash;
    console.log("txHash: ", txHash);
    return txHash

  } catch (err) {
    console.error(err);
  }
};

async function concordTopup(to, amount) {
  try {

    const concord = await loadContract();

    amount = ethers.utils.parseEther(amount);
    const recipientId = await concord.getUserId(to);

    console.log("to: ", to);
    console.log("amount: ", amount.toString());
    
    const call = await concord.topup(recipientId, to, amount);    

    // do we want to wait until the transaction is mined?
    txHash = call.hash;
    console.log("txHash: ", txHash);
    return txHash

  } catch (err) {
    console.error(err);
  }
};

async function concordRegisterMember(address) {
  try {

    const concord = await loadContract();

    const call = await concord.registerMember(address);    

    // do we want to wait until the transaction is mined?
    txHash = call.hash;
    console.log("txHash: ", txHash);
    return txHash

  } catch (err) {
    console.error(err);
  }
};

// These 2 process methods will catch exceptions and give *more details* about the error and stack trace.
process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  logger.error(`Uncaught Exception: ${errorMsg}`);
  console.error(err);
  // Always best practice to let the code crash on uncaught exceptions. 
  // Because you should be catching them anyway.
  process.exit(1);
});

process.on("unhandledRejection", err => {
  logger.error(`Unhandled rejection: ${err}`);
  console.error(err);
});

module.exports = { 
    getSettings, 
    permlevel, 
    awaitReply, 
    toProperCase, 
    loadContract,
    getTodayString, 
    getAccountBalance,
    getWalletBalance,
    isRegistered,
    canVote,
    getInfuraProvider,
    submitProposal,
    concordClaim, 
    concordPropose, 
    concordTip,
    concordWithdraw,
    concordTopup, 
    concordRegisterMember,
    getContractBalance,
    isMember
};