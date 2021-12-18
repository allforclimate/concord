const { concordWithdraw } = require('../modules/functions.js');
const { registeredUsers } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });

  console.log("Hello withdraw!");

  // Get arguments provided by user to command
  const amountRaw = interaction.options.getInteger('amount');
  const amount = amountRaw.toString();
  //const recipient = interaction.options.getUser('to');

  console.log("yo1");


  const author = interaction.user;
  const from = author.id;

  console.log("yo2");

  const recipientAddress = registeredUsers.get(from);

  console.log("yo3");


  await concordWithdraw(recipientAddress,amount);
  await interaction.editReply(`Hey! You just received ${amount} CC on your wallet: https://rinkeby.etherscan.io/tx/${txHash}`);

};

exports.commandData = {
  name: "withdraw",
  description: "Withdraw CC tokens from your account to your wallet.",
  options: [
      {
          name: "amount",
          description: "Amount of tokens to withdraw.",
          type: 4, // type 4 == int
          required: true
      }
  ],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};