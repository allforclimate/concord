const { expect } = require("chai");
const { ethers } = require("hardhat");

let Concord;
let concord;
let discordBot;
let bob;
let alice;
let francis;

beforeEach(async function () {
  [discordBot, bob, alice, francis] = await ethers.getSigners();
});

describe("Deployment", function () {

  it("Should deploy Concord.sol", async function () {
    Concord = await ethers.getContractFactory("Concord");
    concord = await Concord.deploy(discordBot.address, bob.address, "Concord", "CC", ethers.utils.parseEther("20"), {value: ethers.utils.parseEther("1")});
    expect(await concord.owner()).to.equal(discordBot.address);
  });

});

describe("Interactions", function () {

  it("Alice gives 2000 MATIC to the contract", async function () {
    const giveCall = await concord.connect(alice).give({value: ethers.utils.parseEther("2000")});
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("2001"));
  });

  it("Concord executes Bob's proposal", async function () {
    const call = await concord.executeProposal(bob.address, ethers.utils.parseEther("500"), "Pay my lawyer");
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("1501"));
  });

  it("Alice joins as a new member", async function () {
    const call = await concord.connect(discordBot).register(alice.address, 1, ethers.utils.parseEther("20"));
    expect(await concord.balanceOf(concord.address)).to.equal(ethers.utils.parseEther("20"));
  });

  it("Bob withdraws 5 tokens", async function () {
    const call = await concord.connect(discordBot).withdraw(0, ethers.utils.parseEther("10"));
    expect(await concord.balanceOf(bob.address)).to.equal(ethers.utils.parseEther("10"));
  });

  it("Alice sends 10 units to Bob ", async function () {
    const call = await concord.connect(discordBot).tip(1, 0, ethers.utils.parseEther("10"));
    const aliceBal = await concord.users(1);
    const aliceBalFormatted = aliceBal.bal.toString();
    expect(aliceBalFormatted).to.equal(ethers.utils.parseEther("30"));
  });

  it("Alice claims 200 units", async function () {
    const call = await concord.claim(1, ethers.utils.parseEther("200"), "1 week of community management");
    const aliceBalRaw = await concord.users(1);
    const aliceBal = aliceBalRaw.bal.toString();
    expect(aliceBalRaw.bal.toString()).to.equal(ethers.utils.parseEther("230"));
  });

  it("Francis sends 100 ETH to the contract and topups his account", async function () {
    const give = await concord.connect(francis).give({value: ethers.utils.parseEther("100")});
    const topup = await concord.topup(2, francis.address, ethers.utils.parseEther("1"));
    const francisBal = await concord.users(2);
    const francisBalFormatted = francisBal.bal.toString();
    expect(francisBalFormatted).to.equal(ethers.utils.parseEther("1"));
  });
  
  it("Francis wants to ragequit", async function () {

    const call = await concord.executeProposal(bob.address, ethers.utils.parseEther("1.99"), "Pay my lawyer");
   
    console.log(" ");

    const bal1 = await ethers.provider.getBalance(concord.address);
    const balFormatted1 = ethers.utils.formatEther(bal1.toString());
    console.log("    concord balance (before): ", balFormatted1);

    const amountToCashOutRaw = 100;
    const amountToCashOut = amountToCashOutRaw.toString();
    
    const rageQuit = await concord.connect(francis).rageQuit(ethers.utils.parseEther(amountToCashOut));
    
    console.log(" ");

    const bal2 = await ethers.provider.getBalance(concord.address);
    const balFormatted2 = ethers.utils.formatEther(bal2.toString());

    console.log("    concord balance (after): ", balFormatted2);
    console.log(" ");
    console.log("    Diff:", balFormatted2 - balFormatted1, "🎉");
    console.log(" ");

    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("1526.982522522522522600"));

  });

});
