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

const getUserBalanceSample = async () => {
  let account = await getAccount();
  // return account;

  let balance = await getBalance(account);
  // return balance;

  return `${account.slice(0, 10)}: ${balance.slice(1, 10)}`;
};
