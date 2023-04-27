A snap that communicates both with Ethereum to save data and ICP canisters for the
whole orchestration. It sits inside user wallet and handles UI. For now it has
utils for connecting to both Ethereum and ICP as well as porcelain commands as
saveData and loadData scenarios.

Use yarn install followed by mm-snap build for building and mm-snap serve for
local deployment. For production you need to publish it on the npm.
