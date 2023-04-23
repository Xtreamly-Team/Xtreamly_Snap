import { later } from "./utils";
import {
  add0x,
  bytesToHex,
  hexToBytes,
  hasProperty,
  isObject,
  remove0x,
} from "@metamask/utils";
import { decode, encode } from "@metamask/abi-utils";

// Tested
export const getBalance = async (address) => {
  let res = ethereum.request({
    method: "eth_getBalance",
    params: [address],
  });
  return res;
};

// Tested
export const getGasEstimate = async (fromAddress, dataByteCode) => {
  const gasEstimate = await ethereum.request({
    method: "eth_estimateGas",
    params: [{ from: fromAddress, data: dataByteCode }],
  });

  return gasEstimate;
};

// Tested
export const getGasPrice = async () => {
  const gasPrice = ethereum.request({ method: "eth_gasPrice", params: [] });
  return gasPrice;
};

// Tested
export const getChainId = async () => {
  const chainId = ethereum.request({ method: "eth_chainId" });
  return chainId;
};

// Tested
export const getAccount = async () => {
  let res = "";
  try {
    let permissions = await ethereum.request({
      method: "wallet_requestPermissions",
      params: [{ eth_accounts: {} }],
    });
    const accountPermissions = permissions.find(
      (permission) => permission.parentCapability === "eth_accounts"
    );
    if (accountPermissions) {
      console.log("eth_accounts permission successfully requested!");
    }
    res = await ethereum.request({
      method: "eth_accounts",
      params: [],
    });
  } catch (e) {
    res = e;
  }

  return res[0];
};

export const sampleSmartContractAddress =
  "0x40D065045AFbd58F3316bf82196DD0c126F9c43F";
// Tested
export const deploySmartContract = async (fromAddress, byteCode) => {
  // Get gas price and estimate the gas needed for the transaction
  // const gasPrice = await ethereum.request({ method: "eth_gasPrice" });
  const data = byteCode;

  const gasEstimate = await getGasEstimate(fromAddress, data);
  const gasPrice = await getGasPrice();

  // Create transaction object
  const tx = {
    from: fromAddress,
    gasPrice: gasPrice,
    gas: gasEstimate,
    data: data,
    // chainId: 1,
  };

  // Send the transaction and wait for it to be mined
  const txHash = await ethereum.request({
    method: "eth_sendTransaction",
    params: [tx],
  });

  const receipt = await ethereum.request({
    method: "eth_getTransactionReceipt",
    params: [txHash],
  });

  // Extract the contract address from the receipt
  const contractAddress = receipt.contractAddress;

  return contractAddress;
};

const createSetDataFuncAbi = async (
  id_value,
  data_value,
  issuer_value,
  subject_value
) => {
  const setDataFuncSignatureKeccakHash = `0x53104d448dc60631dbc251442c9e111b727478b22af372f5631a90d04a10c930`;

  let encoded = encode(
    ["string", "string", "string", "string"],
    [id_value, data_value, issuer_value, subject_value]
  );

  let funcStringBytes = hexToBytes(setDataFuncSignatureKeccakHash);
  let funcStringFirstFourBytes = funcStringBytes.slice(0, 4);
  let finalArray = new Uint8Array([...funcStringFirstFourBytes, ...encoded]);

  return bytesToHex(finalArray);
};

export const callSetDataSmartContract = async (
  smartContractAddress,
  id_value,
  data_value,
  issuer_value,
  subject_value
) => {
  let account = await getAccount();
  let dataAbi = await createSetDataFuncAbi(
    id_value,
    data_value,
    issuer_value,
    subject_value
  );

  let res = await ethereum.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: account,
        to: smartContractAddress,
        data: dataAbi,
      },
    ],
  });

  return res;
};

// This returns an object with these fields (e.g. ['to']):
// status, to, transactionIndex, transactionHash, type, blockHash, blockNumber,
// contractAddress, cumulativeGasUsed, effectiveGasPrice, from, gasUsed, logs,
// logsBloom. For more info refer to
// https://docs.chainstack.com/reference/ethereum-gettransactionreceipt
export const getTransactionReceipt = async (transaction_hash) => {
  return await ethereum.request({
    method: "eth_getTransactionReceipt",
    params: [transaction_hash],
  });
};

// TODO: Add Timeout
export const waitTillTransactionIsVerified = async (transaction_hash) => {
  while (true) {
    let res = (await getTransactionReceipt(transaction_hash))["status"];
    if (res == "0x1") {
      return true;
    }
    await later(5000);
  }
};


const getUserBalanceSample = async () => {
  let account = await getAccount();
  // return account;

  let balance = await getBalance(account);
  // return balance;

  return `${account.slice(0, 10)}: ${balance.slice(1, 10)}`;
};
