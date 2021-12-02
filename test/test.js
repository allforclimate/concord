const { expect } = require("chai");
const { ethers } = require("hardhat");

let Concord;
let concord;
let discordBot;
let bob;
let alice;

beforeEach(async function () {
  [discordBot, bob, alice] = await ethers.getSigners();
});

describe("Deployment", function () {

  it("Should deploy Concord.sol", async function () {
    Concord = await ethers.getContractFactory("Concord");
    concord = await Concord.deploy(discordBot.address, bob.address, {value: ethers.utils.parseEther("1")});
    expect(await concord.owner()).to.equal(discordBot.address);
  });

});

describe("Interactions", function () {

  it("Should execute a proposal", async function () {
    const call = await concord.executeProposal(bob.address, ethers.utils.parseEther("0.1"), "Pay my lawyer");
    expect(await concord.checkBalance()).to.equal(ethers.utils.parseEther("0.9"));
  });

  it("Should register a new member", async function () {
    const call = await concord.connect(discordBot).register(alice.address);
    expect(await concord.balanceOf(concord.address)).to.equal(ethers.utils.parseEther("400"));
  });

});
