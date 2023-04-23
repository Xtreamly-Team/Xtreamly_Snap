// import detectEthereumProvider from "@metamask/detect-provider";
// import { deployContract } from "./ethereum_utils";
// import { sampleContractCode } from "./sample_contract";
// import { provider } from "ganache";
// let Ganache = require("ganache");
//
//

import {
  callSetDataSmartContract,
  deploySmartContract,
  getAccount,
  waitTillTransactionIsVerified,
} from "./ethereum_utils";
import { VCSmartContractByteCode } from "./vc_smart_contract";

export const _deployVCContract = async (
  id_value,
  data_value,
  issuer_value,
  subject_value
) => {
  let account = await getAccount();
  const vcSmartContractByteCode = VCSmartContractByteCode;

  let deployedContractAddress = await deploySmartContract(
    account,
    vcSmartContractByteCode
  );

  let transaction_hash = await callSetDataSmartContract(
    deployedContractAddress,
    id_value,
    data_value,
    issuer_value,
    subject_value
  );

  let res = await waitTillTransactionIsVerified(transaction_hash);
  if (!res) {
    return "Timeout";
  }
  return deployedContractAddress;
};

export const deployVCContract = async () => {
  return await _deployVCContract("a", "b", "c", "d");
};
