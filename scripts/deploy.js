const hre = require("hardhat");
const fs = require('fs');

// We want ABIs and address in both frontend/ and bot/ repositories

// const contractsDir = __dirname + '/../frontend/src/contracts'; // old
// const contractsDir = __dirname + '/../frontend/contracts/src/ . . . '; // to edit
const contractsDir = __dirname + '/../bot/contracts';

async function main() {
  if (network.name === 'hardhat') {
    console.log('network: ', network.name);
    console.warn(
      'You are trying to deploy a contract to the Hardhat Network, which' +
        'gets automatically created and destroyed every time. Use the Hardhat' +
        " option '--network localhost'"
    );
  }

  console.log('network id: ', network.config.chainId);

  let discordBot;
  let bob;
  
  [discordBot, bob] = await ethers.getSigners();

  const Concord = await ethers.getContractFactory('Concord');
  const concord = await Concord.deploy(discordBot.address,bob.address);

  saveFrontendFiles(concord);

  console.log('Concord deployed to ', concord.address);
}

function saveFrontendFiles(concord) {
  const ConcordArtifact = artifacts.readArtifactSync('Concord');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(contractsDir + '/Concord.json', JSON.stringify(ConcordArtifact, null, 2));
  fs.writeFileSync(contractsDir + '/contractAddress.json', JSON.stringify({ Concord: concord.address }, undefined, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });