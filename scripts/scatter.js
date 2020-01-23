async function main() {
  const Unscatter = artifacts.require('Unscatter');

  const instance = await Unscatter.at('0x2BF82404Ce47333798e9933abfAfC39075905857');

  const DATA = require('../data/filtered.json');

  let chunkSize = 25;
  let gas = '3000000';
  let gasPrice = '2000000000';

  console.log(`scattering ${ DATA.length } addresses`);

  for (let i = 0; i < DATA.length; i += chunkSize) {
    console.log(`index ${ i } / ${ DATA.length }`);
    await instance.scatter(DATA.slice(i, i + chunkSize), { gasPrice, gas });
  }

  console.log(`scattered ${ DATA.length } addresses`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
