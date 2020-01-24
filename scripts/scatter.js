const Unscatter = artifacts.require('Unscatter');

const DATA = require('../data/filtered.json');

async function main() {
  const instance = await Unscatter.at('0x2e5C4A6b25682de9Fa0C0673C72F341dE210D040');

  let gas = '5000000';
  let gasPrice = '2010000000';


  let i = 0;

  while (i < DATA.length) {
    console.log(`index ${ i } / ${ DATA.length }`);

    let head, tail;

    try {
      let shares = await instance.poolShares.call();
      console.log(`shares: ${ shares }`);

      if (shares < 128) {
        head = 25;
        tail = 0;
      } else if (shares < 250) {
        head = 25;
        tail = 25;
      } else {
        head = 0;
        tail = 100;
      }

      let data = DATA.slice(i, i + head);
      for (let j = 0; i < tail; j++) {
        data.push(instance.address);
      }

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
