const multicallABI = require("./abi/multicall");

const { encode, decode } = require("./utils/abi");

module.exports = async (caver, multicallContractAddress, calls) => {
  const multicallContract = new caver.contract(
    multicallABI,
    multicallContractAddress
  );

  const callRequest = calls.map((call) => {
    const {
      arguments,
      _method: { name, inputs },
      _parent: { _address },
    } = call;
    const callData = encode(name, inputs, arguments);

    return {
      target: _address,
      callData,
    };
  });

  const response = await multicallContract.methods
    .aggregate(callRequest)
    .call();

  const callCount = calls.length;
  const callResult = [];
  for (let i = 0; i < callCount; i++) {
    const outputs = calls[i]._method.outputs;
    const returnData = response.returnData[i];

    const params = decode(outputs, returnData);
    const result = outputs.length === 1 ? params[0] : params;
    callResult.push(result);
  }

  return callResult;
};
