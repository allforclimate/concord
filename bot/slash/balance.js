const ethers = require('ethers');
// const { Wallet } = require('ethers');
const fs = require('fs');
// const { permlevel, getTodayString } = require('../modules/functions.js');
const { registeredUsers } = require('../modules/tables.js');
const { getTokenBalance } = require('../modules/functions.js');



require('dotenv').config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();
    const reply = await interaction.editReply("Ping?");

    const address = registeredUsers.get(interaction.user.id);
    console.log("address: ", address);

    const bal = await getTokenBalance(address);



    await interaction.editReply(`Result: ${bal}`);

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