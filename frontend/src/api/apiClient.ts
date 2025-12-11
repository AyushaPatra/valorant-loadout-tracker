import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not set in environment variables!");
}

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

export default apiClient;
