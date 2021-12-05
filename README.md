# Concord

A new form of DAO.

## Motivation

The idea is to give citizens an easy way to create a DAO for their neighborhood. So that they can start rebuilding local resilience, reclaim empty spaces, manage commons, organize. 

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

You can check [this tutorial](https://anidiots.guide/getting-started/getting-started-long-version/) to learn how to test this bot.

Add a `.env` file and add your own credentials. 

```
cd discord-bot
node index.js
```

## Test the frontend

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

- I submit a proposal asking for an amount labelled in MATIC
- The other members vote (adding a `thumb up` emoji)
- I get the money in cash (MATIC)

##### Claim a task

- I claim a task that I performed
- The other members vote (adding a `thumb up` emoji)
- I get the requested amount of tokens

##### Tip someone

- As a member, I can tip another user in Discord
- As a non-member, I first need to topup my account

## Setup

- Add the bot your Discord server
- Deploy an instance of Concord.sol
- Call for contributions

## Contact

You can join us on [Discord](https://discord.gg/uSxzJp3J76) if you want to talk.



