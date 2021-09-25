const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Interactions", function () {

  it("Should receive 1 ETH", async function () {
    
    const KiezDAO = await ethers.getContractFactory("KiezDAO");
    const kiezdao = await KiezDAO.deploy();
    await kiezdao.deployed();
    // ...
    
  });

  it("Should transfer 1 ETH", async function () {
    
    const KiezDAO = await ethers.getContractFactory("KiezDAO");
    const kiezdao = await KiezDAO.deploy();
    await kiezdao.deployed();
    // ...
    
  });

});
