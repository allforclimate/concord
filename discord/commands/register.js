const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');

require('dotenv').config();

exports.run = async (client, message, args, level) => {
    const address = args[0];
    console.log(`address passed: ${address}`);

    if (ethers.utils.isAddress(address)) {
        const author = message.author.toString();
        registeredUsers.set(author, address);
        console.log(`Address for user ${author} in enmap is ${registeredUsers.get(author)}`);
        message.reply(`Thanks for registering ${author}`)
            .then(() => console.log('Replied successfully.'))
            .catch(console.error);
    } else {
        message.reply(`Oops! This doesn't seem to be a valid Ethereum address. 
            Are you sure you entered it correctly?`
        ).then(() => console.log("Replied to wrong address input.")
        ).catch(console.error);
    }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "register",
  category: "Miscellaneous",
  description: "Tie a wallet address to your Discord account.",
  usage: "register"
};
