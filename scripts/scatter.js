const Unscatter = artifacts.require('Unscatter');

const DATA = require('../data/filtered.json');

async function main() {
  const instance = await Unscatter.at('0x2e5C4A6b25682de9Fa0C0673C72F341dE210D040');

  let gas = '5000000';

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
        head = 25;
        tail = 0;
      } else if (shares < 240) {
        head = 25;
        tail = 25;
      } else {
        head = 0;
        tail = 100;
        gasPrice += 0.5e9; // 0.5 gwei
      }

      let data = DATA.slice(i, i + head);
      for (let j = 0; j < tail; j++) {
        data.push(instance.address);
      }

      gasPrice = Math.floor(gasPrice).toString();

      console.log(`gasPrice: ${ gasPrice / 1e9 } gwei`);

      await instance.scatter(data, { gasPrice, gas });
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
