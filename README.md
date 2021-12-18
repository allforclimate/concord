# Concord

A new form of DAO.

## Motivation

The idea is to give citizens an easy way to create a DAO for their neighborhood. So that they can start rebuilding local resilience, reclaim empty spaces, manage commons, and organize events. 

The project is documented in [this Wiki](https://github.com/AllForClimate/concord/wiki).

## Install

```
cd concord
npm install
```

## Test the Solidity contract

```
npx hardhat test
```

## Test the Discord bot

In [this short video](https://youtu.be/0LOVJoY1Lc0):

- A member submits a proposal 
- The community vot in Discord
- The result of the vote triggers a Ethereum transaction 

You can check [this tutorial](https://anidiots.guide/getting-started/getting-started-long-version/) to learn how to test this bot.

Add a `.env` file and add your own credentials. You want to duplicate and rename [`.env.template`](https://github.com/AllForClimate/concord/blob/main/discord/.env.example).

```
cd bot
node index.js
```

## Test the frontend

The frontend is availaible at [https://concord-frontend.netlify.app/](https://concord-frontend.netlify.app/)

To test it locally:

```
cd frontend
yarn install
yarn react-app:start
```

## User workflow

- I join a Discord server
- The admins make me a member (a specific Discord role)
- I have access to the vote channel
- I get myself an Ethereum address (using [Torus Discord login](https://app.tor.us/) or any)
- I declare my Ethereum address

##### Submit a proposal

- I submit a proposal asking for an amount labelled in the DAOs currency of choice (for now ETH)
- The other members vote by clicking the "Yay" or "Nay" buttons
- Once the proposal has passed, I get the money in relevant amount of ETH from the DAO Treasury

##### Claim a task

- I claim a task that I performed
- The other members vote by clicking the "Yay" or "Nay" buttons
- I get the requested amount of tokens*
- *The claim function will launch the minting of community tokens, the claimer will receive the requested amount of community tokens for their contributions.

##### Tip someone

- As a member, I can tip another user in Discord
- As a non-member, I first need to topup my account

## Setup

- Add the bot your Discord server
- Deploy an instance of Concord.sol
- Call for contributions

## Contrib

Feel very free to clone the repo, create your own branch from `develop`, suggest new features or pick one of [these issues](https://github.com/AllForClimate/concord/issues).  

We're available in [Discord](https://discord.gg/uSxzJp3J76).

# Hackathon: DAO Global Hackathon // **Core DAO Tech** track

_Dec 10, 2021 submission_

### Project name

Concord

### Short pitch

#### Pain

Up to now, DAOs have to use multiple tools for daily operations: one for communicating between members, one for managing govenance and maybe another one for rewarding contributors and passing online transactions. This is not user friendly and can be a barrier of entry for normal citizens who are not familiar with the crypto world.

#### Target audience

Local communities

#### Solution

To make it easy for everyone, we provide a new DAO smart contract that is controlled by a Discord bot and connected to a frontend to welcome donations.

Now members of the DAO can discuss project details, create and vote on proposals, claim retroacitve expenses and tip each other for their contributions all through one tool (Discord), OR we shall call it "Concord" :)

### Video demo

[https://youtu.be/0LOVJoY1Lc0](https://youtu.be/0LOVJoY1Lc0)

### Project info

We started the project a few weeks ago (oct 2021), and it took a lot of time to just agree on the core logic and tokenomics. 

Now we need to implement one by one all the features of the smart contract in both the frontend and the Discord bot. The smart contract can be tested. We successfully showcased [a community vote triggering an on-chain token transfer](https://rinkeby.etherscan.io/tx/0xe039c96396bd4d8c0f01f8b412e3517c57b7316678441477b337a7fbdf214545). People will be able to request ETH held in the contract the same way. They'll be able to tip each other, top up their account, withdraw from their account. And we'll display all sorts of info about their DAO on the frontend, and also activate the 'rage quit' function in the frontend. 

### Team Wallet

[0x8CCbFaAe6BC02a73BBe8d6d8017cC8313E4C90A7](https://rinkeby.etherscan.io/address/0x8CCbFaAe6BC02a73BBe8d6d8017cC8313E4C90A7)

### Contact

- Full Name: **Julien Béranger**
- Email: **julien@strat.cc**

### Docs
    
- Github repo: https://github.com/AllForClimate/concord
- Discord bot demo video: https://youtu.be/0LOVJoY1Lc0
- Frontend: https://concord-frontend.netlify.app/
- Wiki: https://github.com/AllForClimate/concord/wiki
- Workflow description: https://whimsical.com/main-h1ifYnZxGyWdQ5E6y92R4
- Etherscan contract page: https://rinkeby.etherscan.io/address/0x8de5469c2e9ed83100121ac84ad3884bbf296d26
- Discord: https://discord.com/invite/uSxzJp3J76
- Open issue: https://github.com/AllForClimate/concord/issues


