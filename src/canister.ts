// let fetch = require('isomorphic-fetch');
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";
import { Actor, HttpAgent } from "@dfinity/agent";

const idlFactory = ({ IDL }) => {
  return IDL.Service({ greet: IDL.Func([IDL.Text], [IDL.Text], ["query"]) });
};

const createActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  // Fetch root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch root key. Check to ensure that your local replica is running"
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const send_hello_to_canister = async (host_string) => {
  const jsonedKey = `[
"04c91f584587b4173af42b21f94ed52b07299e8679f22367da5d03f5b86df17713cc1473a93c2a5b6878a4e8afe07f3de891950e4dc130d14be7790cbd96100c81",
"2a1923194758ee1987a8066db533f9313caee48f9ffae974feb1529fee206d36"
]`;

  // const identity = await Secp256k1KeyIdentity.fromSeedPhrase(seed);
  const identity = await Secp256k1KeyIdentity.fromJSON(jsonedKey);
  // const seed = "test test test test test test test test test test test test";
  // const identity = await Secp256k1KeyIdentity.fromSeedPhrase(seed);
  const effectiveCanisterId = "rrkah-fqaaa-aaaaa-aaaaq-cai";

  // let args = process.argv.slice(2);
  //
  //
  // const fetchOptions = {
  //     headers

  const agent = new HttpAgent({
    identity: await identity,
    host: host_string,
    // host: "http://127.0.0.1:4943",
    // Blocked beacuse of CORS?
    // host: "http://46.249.100.238:4943",
    // host: "https://dinkedpawn.com:443",
    // host: args[0],
    fetch,
  });

  const actor = createActor(effectiveCanisterId, {
    agent,
  });

  // // console.log("Trying to enter ICP realm ...");

   // console.log(actor);
   let res = await actor.greet("World");
  
  // let res = (
  //   await (await fetch("https://jsonplaceholder.typicode.com/todos/1")).json()
  // )["title"].toString();

  // let res = 'Hello Mr.Handsome';
  // console.log(res);
  return res;
};
