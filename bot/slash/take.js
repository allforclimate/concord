const ethers = require('ethers');
const utils = require('ethers');
const { Wallet } = require('ethers');
require('dotenv').config();

exports.run = async (client, interaction) => { // eslint-disable-line no-unused-vars
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
    const wallet = Wallet.fromMnemonic(process.env.MNEMONIC);
    const fs = require('fs');

    async function shoot() {
        try {
            let wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC); 
            wallet = wallet.connect(provider);   
            const abiFile = fs.readFileSync('modules/concordAbi.json');
            const abi = JSON.parse(abiFile);
            const addressRaw = fs.readFileSync('modules/concordAddress.json');
            const addr = JSON.parse(addressRaw);

            const concord = new ethers.Contract(addr.concord, abi, wallet);

            const userAddr = "0x8CCbFaAe6BC02a73BBe8d6d8017cC8313E4C90A7";
            const amount = 1;
            const task = "Gave a hand.";
    
            const call = await concord.claim(userAddr, amount, task);    
            console.log("call: ", call);

            const txHash = call.hash;
            console.log("txHash: ", txHash);
    
        } catch (err) {
            console.error(err);
        }
    }
    
    const call = shoot();

    await interaction.editReply(`Here you go!`);
  };
  
  exports.commandData = {
    name: "take",
    description: "Triggers the claim function.",
    options: [],
    defaultPermission: true,
  };
  
  exports.conf = {
    permLevel: "User",
    guildOnly: false
  };