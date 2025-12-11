import api from "./axios";

export const getAgents = () => {
  return api.get("/api/agents/");
};
