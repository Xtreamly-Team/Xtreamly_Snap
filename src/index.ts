import { OnRpcRequestHandler } from '@metamask/snaps-types';
import {
  copyable,
  divider,
  heading,
  panel,
  spinner,
  text,
} from '@metamask/snaps-ui';

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
    case 'hello':
      return snap.request({
        method: 'snap_dialog',
        params: {
          type: 'confirmation',
          content: panel([
            heading('Alpha'),
            spinner(),
            copyable('Beta'),
            text(`Yellow, **${origin}**!`),
            divider(),
            panel([heading('Beta'), text('Inside Panel')]),
            divider(),
            text('Look Ma!, I hacked a snap'),
            text(
              'But you can edit the snap source code to make it do something, if you want to!',
            ),
          ]),
        },
      });
    case 'read_verifiable_data':
      res = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          placeholder: 'Enter your data',
          content: panel([heading('Enter Verifiable Data'), divider()]),
        },
      });

      snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: `Data saved: ${res}`,
        },
      });

      let sample_did = `did:xtreamly:5123x1231x`;

      res = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'alert',
          content: panel([
            heading('Data Saved'),
            divider(),
            text('You can copy this if you want to use it later manually'),
            copyable(sample_did),
          ]),
        },
      });
      return res;

    case 'notif':
      res = await ethereum.request({
        method: 'eth_gasPrice',
        params: [],
      });
      console.log(res);
      return snap.request({
        method: 'snap_notify',
        params: {
          type: 'inApp',
          message: `Gas Price = ${res}`,
        },
      });
    default:
      throw new Error('Method not found.');
  }
};

function deploySmartContractToEthereum(vc) {
  window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: '0x1322313478123897',
        data: '0x81273127461082731',
      },
    ],
  });
}
