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
            console.log("User's address:", address);

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
            console.log("contract:", addr.concord);
            const concord = new ethers.Contract(addr.concord, abi, provider);
    
            const balanceRaw = await concord.getInContractBalance(address);    
            console.log("balanceRaw", balanceRaw);
            let balanceRaw2 = balanceRaw.toString();
            console.log("balance", balanceRaw2);
            
            message.reply(`You have ${balanceRaw2} CC tokens in your account.`);
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
