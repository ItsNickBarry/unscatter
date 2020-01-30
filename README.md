# Unscatter

Scatter Token ([scatter.cx](https://scatter.cx/)) minting contract.

This repository was generated from a template or is the template itself.  For more information, see [docs/TEMPLATE.md](./docs/TEMPLATE.md).

## Usage

Usage of this contract to mint Scatter Token requires a sizable list of addresses, each of which has a non-zero ether balance and has never held STT.  A suggested approach to generating such a list is to download the list of holders of an extablished token from [Etherscan](https://etherscan.io/tokens?sort=holders&order=desc).  This list should then be converted to a JSON array containing only addresses and saved in the `data/addresses` directory under any filename(s) with a `.json` extension.

### Filtering

To filter a prepared list of addresses:

```bash
URL="https://mainnet.infura.io/v3/[INFURA_KEY]" npx buidler run scripts/filter.js --no-compile --network generic
```

The result will be written to `data/filtered.json`.

### Scattering

To distribute tokens to a filtered list of addresses:

```bash
MNEMONIC="[MNEMONIC]" URL="https://mainnet.infura.io/v3/[INFURA_KEY]" GAS_PRICE="1e9" npx buidler run scripts/scatter.js --no-compile --network generic
```

The contract will execute transfers to itself if the contract's share of the reward pool is sufficient.

## Setup

Install dependencies via Yarn:

```bash
yarn install
```

## Networks

By default, Buidler uses the BuidlerEVM.

To use Ganache append commands with `--network ganache`, after having started `ganache-cli` in a separate process:

```bash
npx ganache-cli
```

To use an external network via URL, set the `URL` environment variable and append commands with `--network generic`:

```bash
URL="https://mainnet.infura.io/v3/[INFURA_KEY]" buidler test --network generic
```

## Development and Testing

Compile contracts via Buidler:

```bash
npx buidler compile
```

Test contracts via Buidler:

```bash
npx buidler test
```

If using a supported network (such as Ganache), activate gas usage reporting by setting the `REPORT_GAS` environment variable to `true`:

```bash
REPORT_GAS=true npx buidler test
```
