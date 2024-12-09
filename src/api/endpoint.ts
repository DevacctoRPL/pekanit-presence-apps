import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.URL_ENDPOINT, // Ambil dari .env
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
