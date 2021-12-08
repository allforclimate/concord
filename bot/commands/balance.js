const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');
const logger = require('../modules/Logger.js');
const { isRegistered, getTokenBalance } = require('../modules/functions.js');
require('dotenv').config();

exports.run = async (client, message, args, level) => {
    try {
        // check if user has registeredUsers
        const authorId = message.author.id;
        if(isRegistered(authorId)) {
            const address = registeredUsers.get(authorId);
            let balance = await getTokenBalance(address);
            message.reply(`You have ${balance.substring(0,20)} tokens in your registered wallet.`);
        } else {
            message.reply(`Looks like you haven't registered your wallet address. ` +  
            `Please first register your wallet using the \`register\` command.`)
                .then(() => logger.log(`User ${message.author.username} tried to get balance without registering.`))
                .catch(console.error);
        }
    } catch (error) {
        logger.error(error);
    }

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "balance",
  category: "DAO",
  description: "Get the balance of tokens in your wallet.",
  usage: "balance"
};
