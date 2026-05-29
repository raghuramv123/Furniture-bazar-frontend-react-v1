import axiosInstance from './axiosInstance';

export const getAddresses   = () => axiosInstance.get('/api/addresses');
export const addAddress     = (data) => axiosInstance.post('/api/addresses', data);
export const updateAddress  = (id, data) => axiosInstance.put(`/api/addresses/${id}`, data);
export const setDefault     = (id) => axiosInstance.put(`/api/addresses/${id}/default`);
export const deleteAddress  = (id) => axiosInstance.delete(`/api/addresses/${id}`);