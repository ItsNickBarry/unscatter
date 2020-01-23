usePlugin('@nomiclabs/buidler-truffle5');
usePlugin('buidler-gas-reporter');

module.exports = {
  solc: {
    version: '0.5.16',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },

  networks: {
    ganache: {
      url: 'http://127.0.0.1:8545',
    },
    generic: {
      // set URL for external network, such as Infura
      url: `${ process.env.URL }`,
      accounts: {
        mnemonic: `${ process.env.MNEMONIC }`,
      },
    },
  },

  gasReporter: {
    gasPrice: 1,
    enabled: !!process.env.REPORT_GAS,
  },
};
