import axios, { type AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    // Vite uses import.meta.env instead of process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;