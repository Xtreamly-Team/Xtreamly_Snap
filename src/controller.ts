import {
  call_create_vc_self_presented,
  call_get_vc,
  call_present_did_address,
} from "./canister";
import { deployVCContract } from "./ethereum_call";
import {
  announcementDialog,
  copyableDoubleResultDialog,
  copyableResultDialog,
  userDataPromptDialog,
  waitingDialog,
} from "./ui/input_data";

export const getDataScenario = async (host, canister_id) => {
  const randomCallbackNumber = Math.floor(Math.random() * 1_000_000);

  const userInputData = await userDataPromptDialog(
    "VC to get",
    "Enter DID of the data that you want to give Dapp access to",
    "did:xtreamly:123123..."
  );

  let res = await call_get_vc(
    host,
    canister_id,
    userInputData,
    "123",
    "123",
    `Canister_Function_Callback_Number_${randomCallbackNumber.toString()}`
  );

  const resString = String(res);

  await copyableResultDialog("Result", "result", res);

  return resString;
};

export const saveDataScenario = async (host, canister_id) => {
  // TODO: Make sure this random call doesn't collide with other calls
  const randomCallbackNumber = Math.floor(Math.random() * 1_000_000);

  await announcementDialog(
    "Welcome",
    `Saving data has 3 steps: In each step a dialog like this one opens and explains what is going to happen in that step.`
  );

  const userInputData = await userDataPromptDialog(
    "Step1: Enter Data",
    "You can enter any data you want to be saved on blockchain by Xtreamly.",
    "For example age: 26"
  );

  await waitingDialog(
    "Step 2: Processing Data",
    `Processing and encrypting data. Feel free to close this dialog and wait for the next one`
  );

  const vcModel = await call_create_vc_self_presented(
    host,
    canister_id,
    userInputData,
    `Canister_Function_Callback_Number_${randomCallbackNumber.toString()}`
  );

  await announcementDialog(
    "Step 3: Deploying on blockchain",
    `Deploying on the blockchain. In this step you have to connect your wallet, if you haven't already done so, then you have to allow the transaction so that we can save the encrypted version on the blockchain`
  );

  const contractAddress = await deployVCContract(
    vcModel.raw_string,
    vcModel.data,
    vcModel.issuer,
    "SUBJECT"
  );

  const sentDIDAddressPair = await call_present_did_address(
    host,
    canister_id,
    vcModel.did,
    contractAddress
  );

  return await copyableDoubleResultDialog(
    "Congratulation",
    "Your encrypted data has been saved to blockchain. Here are the addresses for the data if you want to manually access it later.",
    `DID: `,
    `${vcModel.did}`,
    `Blockchain Address: `,
    `${contractAddress}`
  );
};
