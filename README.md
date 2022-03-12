# klaytn-multicall-kas

Gets multiple results with a single contract call

## Installation

```sh
npm install klaytn-multicall-kas
yarn add klaytn-multicall-kas
```

## API

- `.aggregate(calls)`: Excute calls in a single request
- `.getKlaytnBalanceMethod(address)`: return `getEthBalance(address)` method
- `.getKlaytnBalance(address)`: return klaytn balance in address
- `.getBlockHash(blockNumber)`: return blockHash
- `.getLastBlockHash()`: return last block hash
- `.getCurrentBlockTimestamp()`: return current block timestamp
- `.getCurrentBlockDifficulty()`: return current block difficulty
- `.getCurrentBlockGasLimit()`: return current block gas limit
- `.getCurrentBlockCoinbase()`: return current block coinbase

## Example

```js
require("dotenv").config();

const { Provider } = require("klaytn-multicall-kas");

const CaverExtKAS = require("caver-js-ext-kas");

const { CYPRESS_CHAIN_ID, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

const caver = new CaverExtKAS(
  CYPRESS_CHAIN_ID,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY
);

const provider = new Provider(caver);
const erc20ABI = require("./abi/erc20");

const run = async () => {
  // Klay - KSP Liquidity Pool in KlaySwap
  const klaySwapAndKlayPoolAddress =
    "0x34cf46c21539e03deb26e4fa406618650766f3b9";

  const klaySwapProtocolContractAddress =
    "0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654";

  const klaySwapProtocolContract = new caver.contract(
    erc20ABI,
    klaySwapProtocolContractAddress
  );

  const calls = [
    provider.getKlayBalanceMethod(klaySwapAndKlayPoolAddress),
    klaySwapProtocolContract.methods.balanceOf(klaySwapAndKlayPoolAddress),
  ];

  const [klayBalance, kspBalance] = await provider.aggregate(calls);

  console.log(`
  klayBalance: ${klayBalance.toString()}
  kspBalance: ${kspBalance.toString()}
  `);
};

run();
```

## Test

```sh
npm run test
```
