/**
 * MIT License

Copyright (c) 2020 Cavan Flynn

https://github.com/cavanmflynn/ethers-multicall/blob/master/src/abi.ts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

const { ethers } = require("ethers");

exports.encode = (name, inputs, params) => {
  const functionSignature = getFunctionSignature(name, inputs);
  const functionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(functionSignature)
  );
  const functionData = functionHash.substring(2, 10);
  const abiCoder = new ethers.utils.AbiCoder();
  const argumentString = abiCoder.encode(inputs, params);
  const argumentData = argumentString.substring(2);
  const inputData = `0x${functionData}${argumentData}`;
  return inputData;
};

exports.decode = (outputs, data) => {
  const abiCoder = new ethers.utils.AbiCoder();
  const params = abiCoder.decode(outputs, data);
  return params;
};

function getFunctionSignature(name, inputs) {
  const types = [];
  for (const input of inputs) {
    if (input.type === "tuple") {
      const tupleString = getFunctionSignature("", input.components);
      types.push(tupleString);
      continue;
    }
    if (input.type === "tuple[]") {
      const tupleString = getFunctionSignature("", input.components);
      const arrayString = `${tupleString}[]`;
      types.push(arrayString);
      continue;
    }
    types.push(input.type);
  }
  const typeString = types.join(",");
  const functionSignature = `${name}(${typeString})`;
  return functionSignature;
}
