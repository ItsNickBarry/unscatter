const Unscatter = artifacts.require('Unscatter');

const DATA = require('../data/filtered.json');

const UNSCATTER = require('../data/deployed.json').unscatter;

async function main() {
  const instance = await Unscatter.at(UNSCATTER);

  let gas = '7500000';

  let i = 0;

  while (i < DATA.length) {
    console.log(`index ${ i } / ${ DATA.length }`);

    let head, tail;
    let gasPrice = Math.floor(parseFloat(process.env.GAS_PRICE)) + 1e7;

    if (isNaN(gasPrice)) {
      console.log('GAS_PRICE environment variable must be set');
      process.exit(1);
    }

    try {
      let shares = await instance.poolShares.call();
      console.log(`shares: ${ shares }`);

      if (shares < 128) {
        head = 64;
        tail = 0;
      } else if (shares < 240) {
        head = 64;
        tail = 25;
      } else {
        head = 0;
        tail = 256;
      }

      let data = DATA.slice(i, i + head);
      for (let j = 0; j < tail; j++) {
        data.push(instance.address);
      }

      gasPrice = Math.floor(gasPrice).toString();
      let scatterAmount = web3.utils.toBN(7e18);

      console.log(`gasPrice: ${ gasPrice / 1e9 } gwei`);

      await instance.scatter(data, scatterAmount, { gasPrice, gas });
    } catch (e) {
      console.log(e);
    } finally {
      i += head;
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
