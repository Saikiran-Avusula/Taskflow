import axios from 'axios';

const configuredApiUrl = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL;
const defaultApiUrl = import.meta.env.PROD
  ? 'https://taskflow-api-04sh.onrender.com'
  : 'http://localhost:8080';

const api = axios.create({
  baseURL: configuredApiUrl ?? defaultApiUrl,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
