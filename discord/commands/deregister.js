const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');

require('dotenv').config();

exports.run = async (client, message, args, level) => {
    const authorMention = message.author.toString();
    const authorId = message.author.id;

    try {
        registeredUsers.delete(authorId);
        message.reply(`You have been successfully deregistered ${authorMention}. Now I'm sad.`);
    } catch(e) {
        if (e instanceof TypeError) {
            message.reply("Looks like you weren't registered. Maybe let's change that?");
        }
    }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "deregister",
  category: "Miscellaneous",
  description: "Remove wallet address from your Discord account.",
  usage: "deregister"
};
