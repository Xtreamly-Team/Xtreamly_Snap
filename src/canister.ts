// Due to certificate.verify bug whose reason is the restriction on snap runtime
// execution environment, update (not query) calls to canisters return error.
// These should be separated into two calls.
import {
  createAgent,
  createActor,
  sampleIdlFactory,
  sampleJsonedKey,
} from "./canister_utils";
import { later } from "./utils";

export const send_greet_to_canister = async (host, canister_id) => {
  const canisterId = "rkp4c-7iaaa-aaaaa-aaaca-cai";

  const actor = await createActor(host, canisterId, sampleIdlFactory);

  let res = await actor.greet("It Worked");

  return res;
};

export const call_create_vc_self_presented = async (
  host: any,
  canisterId: any,
  selfPresentedData: any,
  callbackId: any
) => {
  let idlFactory = ({ IDL }) => {
    return IDL.Service({
      create_vc_self_presented: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    });
  };
  let actor = await createActor(host, canisterId, idlFactory);

  try {
    let res = await actor.create_vc_self_presented(
      selfPresentedData,
      callbackId
    );
  } catch {
    // Won't do anything here since the error is not related to us, its related
    // to snap not being able to verify certificate
  }

  idlFactory = ({ IDL }) => {
    return IDL.Service({
      create_vc_self_presented_status: IDL.Func(
        [IDL.Text],
        [IDL.Text],
        ["query"]
      ),
    });
  };

  let finalRes = "";

  actor = await createActor(host, canisterId, idlFactory);
  while (true) {
    await later(5000);
    let res = await actor.create_vc_self_presented_status(callbackId);
    if (res) {
      finalRes = res;
      break;
    }
  }

  const vc_proof_pair = finalRes.split("\n");

  const vc_raw = vc_proof_pair[0];
  const proof_raw = vc_proof_pair[1];

  const vc = JSON.parse(vc_raw);
  const proof = JSON.parse(proof_raw);

  const did = proof["verification_method"];

  return did;

};
