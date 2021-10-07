ethers = require('ethers');
require('dotenv').config();

exports.run = async (client, message, args, level) => {
    try {
        apiKey = {
            projectId: process.env.INFURA_PROJECT_ID,
            projectSecret: process.env.INFURA_PROJECT_SECRET
        };
        provider = new ethers.providers.InfuraProvider(network='rinkeby', apiKey);
        balance = await provider.getBalance('0xb3e3D434c074272C8E99c88D40F188b92274A891');
        console.log(ethers.utils.formatEther(balance));
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
  name: "test",
  category: "Miscellaneous",
  description: "Testing a new command.",
  usage: "test"
};
