import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";
import "@nomicfoundation/hardhat-chai-matchers";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {task} from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import {Treasury} from "./typeChain";
import {readConfig, verifyContract, writeConfig} from "./scripts/util";

const paramIFO = {
  addressBusd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  addressUsdt: "0x55d398326f99059fF775485246999027B3197955",
  addressPancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  startTimeSale: 1676707200,
  endTimeSale: 1676772000,
  startTimeVesting: 1676775600,
  durationVesting: 21600

}

const paramIDO = {
  addressBusd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  addressUsdt: "0x55d398326f99059fF775485246999027B3197955",
  addressPancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  startTimeSale: 1676707200,
  endTimeSale: 1676772000,
  startTimeVesting: 1676775600,
  durationVesting: 21600,
  timeStampVest20Percent: 1676773800

}

const paramPrivate = {
  addressBusd: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
  addressUsdt: "0x55d398326f99059fF775485246999027B3197955",
  addressPancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  startTimeSale: 1676707200,
  endTimeSale: 1676772000,
  startTimeVesting: 1676775600,
  durationVesting: 21600,
}
task("deploy-treasury-and-token", "deploy treasury and token", async (taskArgs, hre) => {

  let configData = await readConfig('config.json');
  configData = await deployTreasury(configData, hre);
  configData = await deployToken(configData, hre, configData.treasury);


  const treasury = await hre.ethers.getContractFactory("Treasury")

  const instanceTreasury =  (await  treasury.attach(configData.treasury)) as  unknown as Treasury;

  let tx = await instanceTreasury.setToken(configData.token)

  await tx.wait(3);

  await deployTemplateVesting(configData, hre);


  await writeConfig('config.json', configData);
})


task("deploy-ifo-sale-contract", "deploy sale contract", async (taskArgs, hre) => {

  let configData = await readConfig('config.json');

  configData = await deployIFOSaleContract(hre,configData)

  await writeConfig('config.json', configData);
})


task("deploy-ido-sale-contract", "deploy sale contract", async (taskArgs, hre) => {

  let configData = await readConfig('config.json');

  configData = await deployIDOSaleContract(hre,configData)

  await writeConfig('config.json', configData);
})


task("deploy-priate-sale-contract", "deploy sale contract", async (taskArgs, hre) => {

  let configData = await readConfig('config.json');

  configData = await deployPrivateSaleContract(hre,configData)

  await writeConfig('config.json', configData);
})

task ("setup", "setup contract", async (taskArgs, hre: HardhatRuntimeEnvironment) => {
  let configData = await readConfig('config.json');

  let tx;

  const treasury = await hre.ethers.getContractFactory("Treasury")

  const instanceTreasury =  (await  treasury.attach(configData.treasury)) as  unknown as Treasury;

  tx = await instanceTreasury.setCounterparty(configData.IDOSale)
  await tx.wait(3);
  tx = await instanceTreasury.setCounterparty(configData.IFOSale)
  await tx.wait(3);
  tx = await instanceTreasury.setCounterparty(configData.PrivateSale)
  await tx.wait(3);

})



const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },

    bsc_mainnet: {
      url: "https://bsc-dataseed2.binance.org/",
      chainId: 56,
      accounts: [],
    },
    bsc_mainnet_test: {
      url: "https://bsc-dataseed2.binance.org/",
      chainId: 56,
      accounts: [],
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545/",
      chainId: 97,
      accounts: []
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.9",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.0",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.8.2",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    currency: "BNB",
    gasPrice : 20
  },
  etherscan: {
    apiKey: "RGT5TUV486CVH1RQESI4WIRW63NX5HM7KH",
  },
  typechain: {
    outDir: "typeChain",
    target: "ethers-v5",
  },
  mocha: {
    timeout: 100000,
  },
};



async function deployIFOSaleContract(hre : HardhatRuntimeEnvironment, configData: any) {


  let params = []


  const ifoSale = await hre.ethers.getContractFactory("IFOSale")

  params = [
    configData.treasury,
    paramIFO.addressBusd,
    paramIFO.addressUsdt,
    configData.token,
    paramIFO.addressPancakeRouter,
    paramIFO.startTimeSale,
    paramIFO.endTimeSale,
    paramIFO.startTimeVesting,
    paramIFO.durationVesting,
  ]
  let hardhatDeployContractIFO = await ifoSale.deploy(...params);

  await hardhatDeployContractIFO.deployTransaction.wait(5);

  let address = hardhatDeployContractIFO.address
  console.log("IFO deployed address: ", address);
  configData.IFOSale = address

  await verifyContract(hre, address, params, "contracts/IFOSale.sol:IFOSale");

  return configData;

}

async function deployIDOSaleContract(hre : HardhatRuntimeEnvironment, configData: any) {


  let params = []

  const idoSale = await hre.ethers.getContractFactory("IDOSale")

  params = [
    configData.treasury,
    paramIDO.addressBusd,
    paramIDO.addressUsdt,
    configData.token,
    paramIDO.addressPancakeRouter,
    paramIDO.startTimeSale,
    paramIDO.endTimeSale,
    paramIDO.startTimeVesting,
    paramIDO.durationVesting,
    paramIDO.timeStampVest20Percent
  ]
  let hardhatDeployContractIdo = await idoSale.deploy(...params);

  await hardhatDeployContractIdo.deployTransaction.wait(5);

  const address = hardhatDeployContractIdo.address
  console.log("IDO deployed address: ", address);
  configData.IDOSale = address
  await verifyContract(hre, address, params, "contracts/IDOSale.sol:IDOSale");
  return configData;

}


async function deployPrivateSaleContract(hre : HardhatRuntimeEnvironment, configData: any) {


  let params = []


  const privateSale = await hre.ethers.getContractFactory("PrivateSale")

  params = [
    configData.treasury,
    paramPrivate.addressBusd,
    paramPrivate.addressUsdt,
    configData.token,
    paramPrivate.addressPancakeRouter,
    paramPrivate.startTimeSale,
    paramPrivate.endTimeSale,
    paramPrivate.startTimeVesting,
    paramPrivate.durationVesting,
  ]
  let hardhatDeployContractPrivate = await privateSale.deploy(...params);

  await hardhatDeployContractPrivate.deployTransaction.wait(5);

  const address = hardhatDeployContractPrivate.address
  console.log("private deployed address: ", address);
  configData.PrivateSale = address

  await verifyContract(hre, address, params, "contracts/PrivateSale.sol:PrivateSale");


  return configData;

}



async function deployTreasury(configData, hre : HardhatRuntimeEnvironment) {

  const treasury = await hre.ethers.getContractFactory("Treasury")


  const hardhatDeployContract = await treasury.deploy();

  await hardhatDeployContract.deployTransaction.wait(5);

  const address = hardhatDeployContract.address
  console.log("Treasury deployed address: ", address);
  configData.treasury = address

  await verifyContract(hre, address, [], "contracts/Treasury.sol:Treasury");

  return configData;
}

async function deployToken(configData, hre : HardhatRuntimeEnvironment, treasury: string) {

  const vesToken = await hre.ethers.getContractFactory("OMNToken")


  const hardhatDeployContract = await vesToken.deploy(treasury);

  await hardhatDeployContract.deployTransaction.wait(5);

  const address = hardhatDeployContract.address
  console.log("Token deployed address: ", address);
  configData.token = address

  await verifyContract(hre, address, [treasury], "contracts/OMNToken.sol:OMNToken");

  return configData;
}



async function deployTemplateVesting(configData, hre : HardhatRuntimeEnvironment) {
  const idoVestingWalletOMN = await hre.ethers.getContractFactory("IDOVestingWalletOMN")
  const vestingWalletOMN = await hre.ethers.getContractFactory("VestingWalletOMN")

  const param  = [
    "0x000000000000000000000000000000000000dEaD",
    9999999999,
    9999999999,
    9999999999,
    "0x000000000000000000000000000000000000dEaD",
    9999999999,
    99999999999
  ]

  const param1  = [
    "0x000000000000000000000000000000000000dEaD",
    9999999999,
    9999999999,
    9999999999,
    "0x000000000000000000000000000000000000dEaD"
  ]


  const hardhatDeployContract = await idoVestingWalletOMN.deploy(...param);

  await hardhatDeployContract.deployTransaction.wait(5);

  await verifyContract(hre, hardhatDeployContract.address, param, "contracts/implements/IDOVestingWalletOMN.sol:IDOVestingWalletOMN");




  const hardhatDeployContract1 = await vestingWalletOMN.deploy(...param1);

  await hardhatDeployContract1.deployTransaction.wait(5);

  await verifyContract(hre, hardhatDeployContract1.address, param1, "contracts/implements/VestingWalletOMN.sol:VestingWalletOMN");

  return configData;

}


export default config;



