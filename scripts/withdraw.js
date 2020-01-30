const Unscatter = artifacts.require('Unscatter');

const UNSCATTER = require('../data/deployed.json').unscatter;

async function main() {
  const instance = await Unscatter.at(UNSCATTER);

  await instance.withdraw('0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd', { gas: '1000000' });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
