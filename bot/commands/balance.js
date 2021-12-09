const ethers = require('ethers');
const { registeredUsers } = require('../modules/tables.js');
const logger = require('../modules/Logger.js');
const { isRegistered, getTokenBalance } = require('../modules/functions.js');
require('dotenv').config();
const { Wallet } = require('ethers');
const fs = require('fs');


exports.run = async (client, message, args, level) => {
    try {
        // check if user has registeredUsers
        const authorId = message.author.id;
        if(isRegistered(authorId)) {
            const address = registeredUsers.get(authorId);

            function getInfuraProvider() {
                const apiKey = {
                    projectId: process.env.INFURA_PROJECT_ID,
                    projectSecret: process.env.INFURA_PROJECT_SECRET
                };
                const provider = new ethers.providers.InfuraProvider(network=process.env.NETWORK, apiKey);
                return provider;
            }
            
            const provider = getInfuraProvider();
            const wallet = Wallet.fromMnemonic(process.env.MNEMONIC);

            const abiFile = fs.readFileSync('modules/concordAbi.json');
            const abi = JSON.parse(abiFile);
            const addressRaw = fs.readFileSync('modules/concordAddress.json');
            const addr = JSON.parse(addressRaw);

            const concord = new ethers.Contract(addr.concord, abi, provider);
    
            const balanceRaw = await concord.users(0);    

            let balanceRaw2 = balanceRaw.bal;
            let balance = ethers.utils.formatEther(balanceRaw2.toString());
            console.log("balance", balance);
            message.reply(`You have ${balance.substring(0,20)} CC tokens in your account.`);
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
