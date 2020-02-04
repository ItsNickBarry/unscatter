const fs = require('fs');

const Unscatter = artifacts.require('Unscatter');

const DATA = require('../data/data.js');

const UNSCATTER = require('../data/deployed.json').unscatter;

async function main() {
  const instance = await Unscatter.at(UNSCATTER);

  let result = [];

  let chunkSize = 1500;

  console.log(`filtering ${ DATA.length } addresses`);

  for (let i = 0; i < DATA.length; i += chunkSize) {
    console.log(`index ${ i } / ${ DATA.length }`);
    let filtered = (await instance.filter.call(DATA.slice(i, i + chunkSize))).filter(function (el) {
      return !web3.utils.toBN(el).isZero();
    });
    result.push(...filtered);
  }

  result = [...new Set(result)];

  console.log(`filtered ${ result.length } addresses`);
  fs.writeFileSync('data/filtered.json', JSON.stringify(result));
  console.log('wrote data to data/filtered.json');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
