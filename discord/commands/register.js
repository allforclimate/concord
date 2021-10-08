const ethers = require('ethers');
const logger = require('../modules/Logger.js');
const { registeredUsers } = require('../modules/tables.js');

require('dotenv').config();

exports.run = async (client, message, args, level) => {
    const address = args[0];
    const authorId = message.author.id;
    const authorMention = message.author.toString();
    const username = message.author.username;

    if (ethers.utils.isAddress(address)) {
        registeredUsers.set(authorId, address);
        message.reply(`Thanks for registering ${authorMention}`)
            .then(() => logger.log(`${username}'s wallet address has been registered successfully.`))
            .catch(console.error);
    } else {
        message.reply(`Oops! This doesn't seem to be a valid Ethereum address. ` + 
            `Are you sure you entered it correctly?`)
        .then(() => logger.log(`${authorId} tried to register an incorrect address.`))
        .catch(console.error);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "register",
  category: "Miscellaneous",
  description: "Tie a wallet address to your Discord account.",
  usage: "register"
};
