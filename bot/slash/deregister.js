const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });
  const userId = interaction.user.id;
  const userName = interaction.user.username;

  registeredUsers.delete(userId);

  interaction.editReply({
      content: `No worries ${userName}, you wallet address has been deleted.`,
      ephemeral: true
  });

};

exports.commandData = {
  name: "deregister",
  description: "Deregister wallet address.",
  options: [],
  defaultPermission: true,
};

// Set guildOnly to true if you want it to be available on guilds only.
// Otherwise false is global.
exports.conf = {
  permLevel: "User",
  guildOnly: false
};