import { OnRpcRequestHandler } from "@metamask/snaps-types";
import {
  copyable,
  divider,
  heading,
  panel,
  spinner,
  text,
} from "@metamask/snaps-ui";

import {
  register_vc_call_to_canister,
  send_create_vc_self_presented_call_to_canister,
  call_create_vc_self_presented,
  send_greet_to_canister,
  call_present_did_address,
} from "./canister";
import { saveDataScenario } from "./controller";

import { deployVCContract } from "./ethereum_call";

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @throws If the request method is not valid for this snap.
 * @returns The result of `snap_dialog`.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  let res = null;
  switch (request.method) {
    case "hello":
      return snap.request({
        method: "snap_dialog",
        params: {
          type: "confirmation",
          content: panel([
            heading("Alpha"),
            spinner(),
            copyable("Beta"),
            text(`Yellow, **${origin}**!`),
            divider(),
            panel([heading("Beta"), text("Inside Panel")]),
            divider(),
            text("Look Ma!, I hacked a snap"),
            text(
              "But you can edit the snap source code to make it do something, if you want to!"
            ),
          ]),
        },
      });
    case "read_verifiable_data":
      res = await snap.request({
        method: "snap_dialog",
        params: {
          type: "prompt",
          placeholder: "Enter your data",
          content: panel([heading("Enter Verifiable Data"), divider()]),
        },
      });

      snap.request({
        method: "snap_notify",
        params: {
          type: "inApp",
          message: `Data saved: ${res}`,
        },
      });

      let sample_did = `did:xtreamly:5123x1231x`;

      res = await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([
            heading("Data Saved"),
            divider(),
            text("You can copy this if you want to use it later manually"),
            copyable(sample_did),
          ]),
        },
      });
      return res;

    case "notif":
      // res = await deployVCContract();

      let my_dialog = await snap.request({
        method: "snap_dialog",
        params: {
          type: "alert",
          content: panel([heading("Result:"), divider(), copyable(res)]),
        },
      });
      return my_dialog;

      break;
    case "remote":
      await saveDataScenario(
        "http://127.0.0.1:4943",
        "ryjl3-tyaaa-aaaaa-aaaba-cai"
      );
      break;
    default:
      throw new Error("Method not found.");
  }
};
