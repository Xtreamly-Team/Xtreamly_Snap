// import detectEthereumProvider from "@metamask/detect-provider";
// import { deployContract } from "./ethereum_utils";
// import { sampleContractCode } from "./sample_contract";
// import { provider } from "ganache";
// let Ganache = require("ganache");

import {
  deploySmartContract,
  getAccount,
  getBalance,
  getGasEstimate,
  getGasPrice,
} from "./ethereum_utils";
import { sampleContractByteCode } from "./sample_contract";

export const deployVCContract = async () => {
  let account = await getAccount();
  let gasPrice = await getGasPrice();

  let deployedContractAddress = await deploySmartContract(
    account,
    sampleContractByteCode
  );

  return deployedContractAddress;

  // return `${gasPrice.slice(0, 15)}: ${gasEstimate.slice(0, 15)}`;
};
