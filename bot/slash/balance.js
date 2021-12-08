const ethers = require('ethers');
// const { Wallet } = require('ethers');
const fs = require('fs');
// const { permlevel, getTodayString } = require('../modules/functions.js');

require('dotenv').config();

// returns the balance of user's wallet
exports.run = async (interaction, message) => { // eslint-disable-line no-unused-vars
    await interaction.deferReply();

    function getInfuraProvider() {
        const apiKey = {
            projectId: process.env.INFURA_PROJECT_ID,
            projectSecret: process.env.INFURA_PROJECT_SECRET
        };
        const provider = new ethers.providers.InfuraProvider(network=process.env.NETWORK, apiKey);
        return provider;
    }
    const provider = getInfuraProvider();

    async function checkMyBalance(message) {
        try {
            let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC); 
            wallet = wallet.connect(provider);   
            const abiFile = fs.readFileSync('modules/concordAbi.json');
            const abi = JSON.parse(abiFile);
            const addressRaw = fs.readFileSync('modules/concordAddress.json');
            const addr = JSON.parse(addressRaw);
            const concord = new ethers.Contract(addr.concord, abi, wallet);

            const userAddr = message.author.address ;
            const amount = 1;
            const task = "Gave a hand.";
            console.log("userAddr: ", userAddr);

            const call = await concord.balanceOf(userAddr);    
            console.log("call: ", call);
    
        } catch (err) {
            console.error(err);
        }
    }
    
    const bal = checkMyBalance();

    await interaction.editReply(`Hey ${message.author.address}! What's up? You currently own ${bal} `);
  };
  
  exports.commandData = {
    name: "balance",
    description: "Display user's wallet balance of token.",
    options: [],
    defaultPermission: true,
  };
  
  exports.conf = {
    permLevel: "User",
    guildOnly: false
  };