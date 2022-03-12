const { CHAIN_ID_CYPRESS, CHAIN_ID_BAOBAB } = require("caver-js-ext-kas");
const { Message, ContractAddress } = require("./constant");
const aggregate = require("./aggregate");
const multicallABI = require("./abi/multicall");

class Provider {
  constructor(caver) {
    if (!caver || (caver && !caver.kas)) {
      throw new Error(Message.CAVER_NOT_SET_OR_INVAILD);
    }

    this.caver = caver;
    this.multicallContractAddress = this.getMulticallAddressForChainId(
      caver.kas.anchor._accessOptions._chainId
    );
    this.multicallContract = new this.caver.contract(
      multicallABI,
      this.multicallContractAddress
    );
  }

  getMulticallAddressForChainId(chainId) {
    if (
      chainId !== CHAIN_ID_BAOBAB.toString() &&
      chainId !== CHAIN_ID_CYPRESS.toString()
    ) {
      throw new Error(Message.DONT_SUPPORT_CHAIN);
    }
    return ContractAddress[chainId];
  }

  async aggregate(calls) {
    return await aggregate(this.caver, this.multicallContractAddress, calls);
  }

  getKlayBalanceMethod(address) {
    if (!address) {
      throw new Error(Message.ADDRESS_UNDEFINED);
    }

    return this.multicallContract.methods.getEthBalance(address);
  }

  async getKlayBalance(address) {
    if (!address) {
      throw new Error(Message.ADDRESS_UNDEFINED);
    }

    return await this.multicallContract.methods.getEthBalance(address).call();
  }

  async getBlockHash(blockNumber) {
    if (!blockNumber && blockNumber !== 0) {
      throw new Error(Message.BLOCK_NUMBER_UNDEFINED);
    }
    return await this.multicallContract.methods
      .getBlockHash(blockNumber)
      .call();
  }

  async getLastBlockHash() {
    return await this.multicallContract.methods.getLastBlockHash().call();
  }

  async getCurrentBlockTimestamp() {
    return await this.multicallContract.methods
      .getCurrentBlockTimestamp()
      .call();
  }

  async getCurrentBlockDifficulty() {
    return await this.multicallContract.methods
      .getCurrentBlockDifficulty()
      .call();
  }

  async getCurrentBlockGasLimit() {
    return await this.multicallContract.methods
      .getCurrentBlockGasLimit()
      .call();
  }

  async getCurrentBlockCoinbase() {
    return await this.multicallContract.methods
      .getCurrentBlockCoinbase()
      .call();
  }
}

module.exports = Provider;
