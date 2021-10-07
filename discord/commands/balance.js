const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');
require('dotenv').config();

exports.run = async (client, message, args, level) => {
    try {
        // check if user has registeredUsers
        const address = registeredUsers.get(message.author.toString());
        if(!address) {
            message.reply(`Looks like you haven't registered your wallet address.
            Please first register your wallet using the register command.`)
                .then(() => console.log(`User ${message.member} tried to get balance without registering.`))
                .catch(console.error);
        } else {
            apiKey = {
                projectId: process.env.INFURA_PROJECT_ID,
                projectSecret: process.env.INFURA_PROJECT_SECRET
            };
            // change network from .env file
            const provider = new ethers.providers.InfuraProvider(network=process.env.NETWORK, apiKey);
            let balance = await provider.getBalance(address);
            balance = ethers.utils.formatEther(balance);
            message.reply(`You have ${balance.substring(0,6)} tokens in your registeredUsers wallet.`);
        }
    } catch (error) {
        console.log(error);
    }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "balance",
  category: "Miscellaneous",
  description: "Get the balance of KD tokens in your registeredUsers wallet.",
  usage: "balance"
};
