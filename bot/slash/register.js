const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply({ ephemeral: true });
  const address = interaction.options.getString('address');
  const userId = interaction.user.id;
  console.log(`address passed: ${address}`);

  if (ethers.utils.isAddress(address)) {
    registeredUsers.set(userId, address);
    // interaction.editReply({content: `Thanks for registering ${author}`, ephemeral: true})
    interaction.editReply({content: `Thanks!`, ephemeral: true})
      .then(() => console.log('Replied successfully.'))
      .catch(console.error);
  } else {
    interaction.editReply({
      content: `Oops! This doesn't seem to be a valid Ethereum address. Are you sure you entered it correctly?`,
      ephemeral: true
    }).then(() => console.log("Replied to wrong address input.")
    ).catch(console.error);
  }
};

exports.commandData = {
  name: "register",
  description: "Register wallet address with DAO to check for governance token balance.",
  options: [
      {
          name: "address",
          description: "Your wallet address.",
          type: 3, // type 3 == string
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