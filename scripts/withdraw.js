async function main() {
  const Unscatter = artifacts.require('Unscatter');

  const instance = await Unscatter.at('0x2e5C4A6b25682de9Fa0C0673C72F341dE210D040');

  await instance.withdraw('0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd', { gas: '1000000' });
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
