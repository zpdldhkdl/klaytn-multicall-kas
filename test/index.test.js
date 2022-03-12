"use strict";

require("dotenv").config();

const expect = require("chai").expect;

const { Provider } = require("../src");

const CaverExtKAS = require("caver-js-ext-kas");

const { CYPRESS_CHAIN_ID, ACCESS_KEY_ID, SECRET_ACCESS_KEY } = process.env;

const caver = new CaverExtKAS(
  CYPRESS_CHAIN_ID,
  ACCESS_KEY_ID,
  SECRET_ACCESS_KEY
);

const provider = new Provider(caver);
const erc20ABI = require("./abi/erc20");

describe("function test in provider", () => {
  it("should return 0x0000000000000000000000000000000000000000000000000000000000000000", async () => {
    const result = await provider.getBlockHash(0);
    expect(result).to.equal(
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    );
  });

  it("should return ADDRESS_UNDEFINED Error", async () => {
    try {
      await provider.getKlayBalance();
    } catch ({ message }) {
      expect(message).to.equal("ADDRESS_UNDEFINED");
    }
  });
});

describe("aggregate test", () => {
  const wemixAddress = "0x5096db80b21ef45230c9e423c373f1fc9c0198dd";
  const wrappedKlayAddress = "0xfd844c2fca5e595004b17615f891620d1cb9bbb2";
  it("should return `WEMIX TOKEN` and `Wrapped KLAY`", async () => {
    const wemixContract = new caver.contract(erc20ABI, wemixAddress);
    const wrappedKlayContract = new caver.contract(
      erc20ABI,
      wrappedKlayAddress
    );

    const calls = [
      wemixContract.methods.name(),
      wrappedKlayContract.methods.name(),
    ];

    const [wemixName, wrappedKlayName] = await provider.aggregate(calls);

    expect(wemixName).to.equal("WEMIX TOKEN");
    expect(wrappedKlayName).to.equal("Wrapped KLAY");
  });
});
