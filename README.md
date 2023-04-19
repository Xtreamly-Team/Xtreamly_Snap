Install snaps cli 
npm install -g @metamask/snaps-CLI

Run yarn in root directory

Use mm-snap commands / yarn scripts to build / evaluate code and manifest. Also
to test, use 'serve' command to make it available as a local snap.
For release deployment, make sure the package.json and manifest.json are in sync
(name, version, ...) and if so, publish the whole package using npm publish. Use
the returned npm:<Name> as the snap identifier in your daap client (browser).


# TypeScript Example Snap

This Snap demonstrates how to develop a Snap with TypeScript.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
