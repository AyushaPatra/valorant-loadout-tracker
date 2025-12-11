import api from "./axios";

export const getSkins = () => {
  return api.get("/api/skins/");
};
