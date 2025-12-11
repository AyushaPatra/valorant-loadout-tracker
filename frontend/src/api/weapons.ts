import api from "./axios";

export const getWeapons = () => {
  return api.get("/api/weapons/");
};
