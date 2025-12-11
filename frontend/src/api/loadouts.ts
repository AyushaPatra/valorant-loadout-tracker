import api from "./axios";

export const getLoadouts = () => {
  return api.get("/api/loadouts/");
};

export const getLoadout = (id: number) => {
  return api.get(`/api/loadouts/${id}/`);
};

export const createLoadout = (data: any) => {
  return api.post("/api/loadouts/", data);
};

export const updateLoadout = (id: number, data: any) => {
  return api.put(`/api/loadouts/${id}/`, data);
};

export const deleteLoadout = (id: number) => {
  return api.delete(`/api/loadouts/${id}/`);
};
