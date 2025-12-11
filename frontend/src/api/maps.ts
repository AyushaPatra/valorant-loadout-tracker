import api from "./axios";

export const getMaps = () => {
  return api.get("/api/maps/");
};
