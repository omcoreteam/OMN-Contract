# OMN Smart Contracts 🚀

> This repository contains the core smart contracts used by the OMN crypto project.

## Deployment

```shell
npx hardhat compile
npx hardhat --network bsc_mainnet deploy-treasury-and-token
npx hardhat --network bsc_mainnet deploy-ifo-sale-contract
npx hardhat --network bsc_mainnet deploy-private-sale-contract
npx hardhat --network bsc_mainnet deploy-ido-sale-contract
npx hardhat --network bsc_mainnet setup
```

## Included Smart Contracts

| Sourcefile                                   | Description                                                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [OMNToken.sol](contracts/OMNToken.sol)       | This is a Solidity smart contract that represents the OMN token. The OMN token is a capped ERC20 token that can be minted and burned. |
| [Treasury.sol](contracts/Treasury.sol)       | This is a simple Solidity smart contract that manages a token resource and access rights to mint a specific type of token.            |
| [IFOSale.sol](contracts/IFOSale.sol)         | This is a Solidity smart contract that manages the token sale in the IFO round.                                                       |
| [PrivateSale.sol](contracts/PrivateSale.sol) | This is a Solidity smart contract that manages the token sale in the Private round.                                                   |
| [IDOSale.sol](contracts/IDOSale.sol)         | This is a Solidity smart contract that manages the token sale in the IDO round.                                                       |

## Audits

| Report                                                                                     | Audit Date     | Organization                                |
| ------------------------------------------------------------------------------------------ | -------------- | ------------------------------------------- |
| [OmegaNetwork_Audit_Report_Solidity_Finance](https://solidity.finance/audits/OmegaNetwork) | March 02, 2023 | [SolidityFinance](https://solidity.finance) |
