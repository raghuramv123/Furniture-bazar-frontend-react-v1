import axiosInstance from './axiosInstance';

export const getCart      = () => axiosInstance.get('/api/cart');
export const addToCart    = (data) => axiosInstance.post('/api/cart', data);
export const updateCart   = (productId, quantity) => axiosInstance.put(`/api/cart/${productId}`, null, { params: { quantity } });
export const removeFromCart = (productId) => axiosInstance.delete(`/api/cart/${productId}`);
export const clearCart    = () => axiosInstance.delete('/api/cart');
export const getCartTotal = () => axiosInstance.get('/api/cart/total');