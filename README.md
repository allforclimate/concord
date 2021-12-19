# Concord

A new form of DAO.

## Motivation

The idea is to give citizens an easy way to create a DAO for their community, so that they can start rebuilding local resilience, reclaim empty spaces, manage commons, organize.

Concord is being built with the support of [All for Climate DAO](https://twitter.com/all4climatedao).

On [December 17, 2021](https://youtu.be/q6Nzmdynfy4?t=1679), the project won the 1st prize of the DAO Global Hackathon's [Core DAO tech](https://gitcoin.co/issue/dao-global-hackathon/open-lane/2/100027110) track.

The project is documented in [this Wiki](https://github.com/AllForClimate/concord/wiki).

## Features

In Discord, users can:

- Create and vote on proposals
- Claim retro-active expanses
- Tip eachother

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

## Deploy 

Please note that Concord is not production-ready yet. When the time's right, you would: 

- Host the bot
- Host the frontend
- Add the bot to your Discord server

## Contrib

Please check [CONTRIBUTION.md](https://github.com/AllForClimate/concord/blob/develop/CONTRIBUTION.md) and the current issues.

We're available in [Discord](https://discord.gg/uSxzJp3J76).