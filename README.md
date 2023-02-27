# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```

```remix
npm install -g @remix-project/remixd
remixd -s ./ --remix-ide https://remix.ethereum.org
```

```deploy
npx hardhat compile
npx hardhat --network bsc_mainnet deploy-treasury-and-token
npx hardhat --network bsc_mainnet deploy-ifo-sale-contract
npx hardhat --network bsc_mainnet setup
```
