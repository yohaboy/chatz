import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_API_URL = process.env.EXPO_PUBLIC_BASE_API_URL || 'http://localhost:8000';

const client = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(async (config) => {
    const token = await storage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default client;
