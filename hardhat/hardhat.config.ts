import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/config';
import '@typechain/hardhat';
import '@nomiclabs/hardhat-ethers';

import '@nomicfoundation/hardhat-toolbox';
import 'tsconfig-paths/register';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import {node_url, accounts} from './utils/network';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    hardhat: {
      // mining: {
      //   auto: false,
      //   interval: [1000, 5000],
      // },
    },
    mainnet: {
      url: node_url('mainnet'),
      accounts: accounts('mainnet'),
    },
    mumbai: {
      url: node_url('mumbai'),
      accounts: accounts('mumbai'),
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  gasReporter: {
    currency: 'USD',
    gasPriceApi:
      'https://api.polygonscan.com/api?module=proxy&action=eth_gasPrice',
    enabled: process.env.REPORT_GAS ? true : false,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    maxMethodDiff: 10,
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 0,
  },
};

export default config;
