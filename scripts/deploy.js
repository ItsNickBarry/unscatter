const Unscatter = artifacts.require('Unscatter');

const SCATTER = '0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd';

async function main() {
  const instance = await Unscatter.new(SCATTER);
  console.log(`Unscatter deployed to ${ instance.address }`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
