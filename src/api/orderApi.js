import axiosInstance from './axiosInstance';

export const placeOrder    = (data) => axiosInstance.post('/api/orders', data);
export const getMyOrders   = () => axiosInstance.get('/api/orders');
export const getOrderById  = (id) => axiosInstance.get(`/api/orders/${id}`);
export const cancelOrder   = (id) => axiosInstance.post(`/api/orders/${id}/cancel`);