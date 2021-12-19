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
    console.log(" ");
    Concord = await ethers.getContractFactory("Concord");
    concord = await Concord.deploy(discordBot.address, bob.address, "Concord", "CC", ethers.utils.parseEther("20"), {value: ethers.utils.parseEther("1")});
    expect(await concord.owner()).to.equal(discordBot.address);
  });

});

describe("Interactions", function () {

  it("Alice gives 2000 MATIC to the contract", async function () {
    console.log(" ");
    await concord.connect(alice).give({value: ethers.utils.parseEther("2000")});
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("2001"));
  });

  it("Concord executes Bob's proposal", async function () {
    await concord.executeProposal(bob.address, ethers.utils.parseEther("500"), "Pay my lawyer");
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("1501"));
  });

  it("Alice joins as a new member", async function () {
    await concord.connect(discordBot).registerMember(alice.address);
    expect(await concord.balanceOf(concord.address)).to.equal(ethers.utils.parseEther("40"));
  });

  it("Alice withdraws 10 tokens", async function () {
    await concord.connect(discordBot).withdraw(1, ethers.utils.parseEther("10"));
    const aliceBal = await concord.users(1);
    const aliceBalFormatted = aliceBal.bal.toString();
    expect(aliceBalFormatted).to.equal(ethers.utils.parseEther("10"));
  });

  it("Alice sends 1 token to Bob ", async function () {
    await concord.connect(discordBot).tip(1, 0, ethers.utils.parseEther("1"));
    const aliceBal = await concord.users(1);
    const aliceBalFormatted = aliceBal.bal.toString();
    expect(aliceBalFormatted).to.equal(ethers.utils.parseEther("9"));
  });

  it("Alice claims 200 tokens", async function () {
    await concord.claimTask(1, ethers.utils.parseEther("200"), "1 week of community management");
    const aliceBalRaw = await concord.users(1);
    expect(aliceBalRaw.bal.toString()).to.equal(ethers.utils.parseEther("209"));
  });

  it("Francis sends 100 MATIC to the contract and topups his account", async function () {
    await concord.connect(francis).give({value: ethers.utils.parseEther("100")});
    await concord.connect(discordBot).registerUser(francis.address);
    await concord.connect(discordBot).topup(3, francis.address, ethers.utils.parseEther("1"));
    const francisBal = await concord.users(3);
    const francisBalFormatted = francisBal.bal.toString();
    expect(francisBalFormatted).to.equal(ethers.utils.parseEther("1"));
  });
  
  it("Francis wants to ragequit", async function () {
    await concord.executeProposal(bob.address, ethers.utils.parseEther("1.99"), "Pay my lawyer");
    await ethers.provider.getBalance(concord.address);
    const amountToCashOutRaw = 1;
    const amountToCashOut = amountToCashOutRaw.toString();
    await concord.connect(francis).rageQuit(ethers.utils.parseEther(amountToCashOut));
    const bal2 = await ethers.provider.getBalance(concord.address);
    expect(await ethers.provider.getBalance(concord.address)).to.equal(ethers.utils.parseEther("1598.326370243693886277"));
  });

  it("Frontend gets users' ID", async function () {
    const getIdRaw = await concord.getUserId(bob.address);
    const getId = getIdRaw.toString();
    const getIdRaw2 = await concord.getUserId(alice.address);
    const getId2 = getIdRaw2.toString();
    const getIdRaw3 = await concord.getUserId(francis.address);
    const getId3 = getIdRaw3.toString();
    const fetch = await concord.users(getId);
    const bobBal = fetch.bal;
    const fetch2 = await concord.users(getId2);
    const aliceBal = fetch2.bal;
    const fetch3 = await concord.users(getId3);
    const francisBal = fetch3.bal;
    expect(bobBal.toString()).to.equal(ethers.utils.parseEther("209"));
    expect(aliceBal.toString()).to.equal(ethers.utils.parseEther("20"));
    expect(francisBal.toString()).to.equal(ethers.utils.parseEther("1"));
  });

  it("Frontend gets Francis in-contract balance", async function () {
    getFrancisBal3 = await concord.getInContractBalance(francis.address);
    expect(getFrancisBal3.toString()).to.equal(ethers.utils.parseEther("1"));
  });
  
});
