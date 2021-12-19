const { concordTip } = require('../modules/functions.js');
const { registeredUsers } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();

  console.log("Hello!");

  // Get arguments provided by user to command
  const amountRaw = interaction.options.getInteger('amount');
  const amount = amountRaw.toString();
  const recipient = interaction.options.getUser('to');
  const author = interaction.user;
  const to = recipient.id;
  const recipientName = recipient.username;
  const from = author.id;
  const authorName = author.username;

  const recipientAddress = registeredUsers.get(to);
  const senderAddress = registeredUsers.get(from);

  await concordTip(senderAddress,recipientAddress,amount);
  await interaction.editReply(`@${authorName} just sent ${amount} CC to @${recipientName}: https://rinkeby.etherscan.io/tx/${txHash} \n \n `);

};

exports.commandData = {
  name: "give",
  description: "Show appreciation by awarding a member some of your tokens.",
  options: [
      {
          name: "amount",
          description: "Amount of tokens you wish to send.",
          type: 4, // type 4 == int
          required: true
      },
      {
          name: "to",
          description: "User who will receive the amount.",
          type: 6, // type 6 == user
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