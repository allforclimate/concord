const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');
const { concordRegisterMember } = require('../modules/functions.js');

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
  await interaction.deferReply();
  const address = interaction.options.getString('address');
  const userId = interaction.user.id;
  console.log(`address passed: ${address}`);

  if (ethers.utils.isAddress(address)) {
    registeredUsers.set(userId, address);

    const txHash = await concordRegisterMember(address);
    interaction.editReply(`Congrats ${interaction.user.username}! As a new member, you just received 20 CC: https://rinkeby.etherscan.io/tx/${txHash} \n \n Welcome to Concord!`)
    // interaction.editReply({content: `Thanks!`, ephemeral: true})
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