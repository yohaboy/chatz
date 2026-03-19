import client from './client';

export const register = (data: any) => client.post('/api/v1/auth/register', data);
export const login = (data: any) => client.post('/api/v1/auth/login', data);
export const getMe = () => client.get('/api/v1/auth/me');
export const googleLogin = () => client.get('/api/v1/auth/google');
