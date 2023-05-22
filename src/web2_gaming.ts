import { _getOwnedGames } from "./steam_utils";

const APIKey = "010EFF3086DB22E74B7FB9DE8FD0F8F6";
const SteamId = "76561198064969907";

export const getSteamOwnedGames = async () => {
  const res = await _getOwnedGames(APIKey, SteamId);
  return res;
};
