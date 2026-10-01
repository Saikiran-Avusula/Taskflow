import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: configuredApiUrl ?? 'http://localhost:8080',
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
