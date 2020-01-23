const fs = require('fs');

async function main() {
  const Unscatter = artifacts.require('Unscatter');

  const instance = await Unscatter.at('0x2BF82404Ce47333798e9933abfAfC39075905857');

  const DATA = require('../data/data.js').slice(0, 2500);

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
