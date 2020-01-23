async function main() {
  const Unscatter = artifacts.require('Unscatter');

  const instance = await Unscatter.at('0x2BF82404Ce47333798e9933abfAfC39075905857');

  await instance.withdraw('0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd', { gas: '1000000' });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
