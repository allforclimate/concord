## Rinkeby test

Oct-07-2021 09:11:25 PM +UTC 

1. [Deploy KiezDAO (with 0.01 ETH in value)](https://rinkeby.etherscan.io/tx/0x719ac0a99866842baf23e5bfc25bfc6b8969f174cf8fb7897230f550b9ee3754)
2. [Deploy CC with KiezDAO address](https://rinkeby.etherscan.io/tx/0xb448534a12f0cab88746fb9b1e056aa627fafc820ce2d89fe456eb04b0aede20)
3. [Set CC address in KiezDAO](https://rinkeby.etherscan.io/tx/0xb448534a12f0cab88746fb9b1e056aa627fafc820ce2d89fe456eb04b0aede20)
4. [Trigger the `register` function in CC](https://rinkeby.etherscan.io/tx/0x8ac350dbb42c642c34c66bb5405fac355c321ee4f3980d783e4a732b04aa89bd)
4. [Trigger the `addProposal` function in KiezDAO](https://rinkeby.etherscan.io/tx/0x10414be447d252204b71c2c57f083d9296c098b49a2132a0f747c010373e0a3a)

CC Token address: **[0x4a0359c72Eb2Ed7109FEC62BE6203461f94A3bC8](https://rinkeby.etherscan.io/token/0x4a0359c72eb2ed7109fec62be6203461f94a3bc8)**

## To do

- In the `addProposal` function, check if the caller holds >= 1,000 CC tokens in his wallet
- Edit the tests
- Add a deploy.js script
