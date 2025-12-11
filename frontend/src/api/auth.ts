import api from "./axios";

export const registerUser = (username: string, password: string) => {
  return api.post("/api/register/", { username, password });
};
