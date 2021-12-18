const ethers = require('ethers');
// const { Wallet } = require('ethers');
const fs = require('fs');
// const { permlevel, getTodayString } = require('../modules/functions.js');
const { registeredUsers } = require('../modules/tables.js');
const { getWalletBalance, getAccountBalance } = require('../modules/functions.js');

require('dotenv').config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();
    const address = registeredUsers.get(interaction.user.id);
    const accBal = await getAccountBalance(address);
    const walletBal = await getWalletBalance(address);
    await interaction.editReply(`You have ${accBal} CC in your account. \n and ${walletBal} CC in your wallet.`);
  };
  
  exports.commandData = {
    name: "balance",
    description: "Display user's wallet balance of token.",
    options: [],
    defaultPermission: true,
  };
  
  exports.conf = {
    permLevel: "User",
    guildOnly: false
  };