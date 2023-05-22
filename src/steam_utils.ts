require("isomorphic-fetch");

const apiBase = "https://api.steampowered.com/IPlayerService/";
export const _getOwnedGames = async (apiKey, steamId) => {
  // http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=010EFF3086DB22E74B7FB9DE8FD0F8F6&steamid=76561198064969907&include_appinfo=true&format=json
  const serviceName = "GetOwnedGames/v0001";
  // const searchParams = new URLSearchParams({
  //   key: apiKey,
  //   steamid: steamId,
  //   include_appinfo: "true",
  //   format: "json",
  // });
  //
  const url =
    `${apiBase}${serviceName}/?` +
    `key=${apiKey}&` +
    `steamid=${steamId}&` +
    `include_appinfo=true&` +
    `format=json`;

  console.log(url);

  // return url;
  try {
    const res = await fetch("http://localhost:3001/api/get_goals", {
      method: "GET",
    });
    return await res.json();
  } catch (e) {
    console.log(e);
    return e;
  }
};
