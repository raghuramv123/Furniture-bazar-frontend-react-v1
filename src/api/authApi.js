import axiosInstance from './axiosInstance';

export const registerUser  = (data) => axiosInstance.post('/api/auth/register', data);
export const loginUser     = (data) => axiosInstance.post('/api/auth/login', data);
export const refreshToken  = (token) => axiosInstance.post('/api/auth/refresh', null, { params: { refreshToken: token } });
export const logoutUser    = (token) => axiosInstance.post('/api/auth/logout', null, { params: { refreshToken: token } });