import axiosInstance from './axiosInstance';

export const createRazorpayOrder = (orderId) => axiosInstance.post(`/api/payments/create-order/${orderId}`);
export const verifyPayment       = (data) => axiosInstance.post('/api/payments/verify', data);