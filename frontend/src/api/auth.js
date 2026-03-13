import api from './client';

export async function login({ email, password }) {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
}

export async function register({ name, email, password }) {
  const response = await api.post('/api/auth/register', null, {
    params: { name, email, password }
  });
  return response.data;
}
