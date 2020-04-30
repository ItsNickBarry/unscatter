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
