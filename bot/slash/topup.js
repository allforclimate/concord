const { concordTopup } = require('../modules/functions.js');
const { registeredUsers } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });

  const amountRaw = interaction.options.getInteger('amount');
  const amount = amountRaw.toString();
  const author = interaction.user;
  const from = author.id;
  const userId = registeredUsers.get(from);

  await concordTopup(userId,amount);
  await interaction.editReply(`Hey! You just sent ${amount} CC to your account: https://rinkeby.etherscan.io/tx/${txHash}`);

};

exports.commandData = {
  name: "topup",
  description: "Topup your account to be able to tip.",
  options: [
      {
          name: "amount",
          description: "Amount of tokens you want to send to your account.",
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