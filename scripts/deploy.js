const hre = require("hardhat");
const fs = require('fs');

const contractsDir = __dirname + '/../frontend/src/contracts';

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

  const KiezDAO = await hre.ethers.getContractFactory("KiezDAO");
  const kiezdao = await KiezDAO.deploy();
  await kiezdao.deployed();
  console.log("KiezDAO deployed to:", kiezdao.address);

  // Deploy CC.sol
  const CC = await ethers.getContractFactory('CC');
  const cc = await CC.deploy(kiezdao.address);

  saveFrontendFiles(cc);

  console.log('CC deployed to ', cc.address);
}

function saveFrontendFiles(cc) {
  const CCArtifact = artifacts.readArtifactSync('CC');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(contractsDir + '/CC.json', JSON.stringify(CCArtifact, null, 2));
  fs.writeFileSync(contractsDir + '/contractAddress.json', JSON.stringify({ CC: cc.address }, undefined, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });