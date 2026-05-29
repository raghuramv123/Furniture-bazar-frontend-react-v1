import axiosInstance from './axiosInstance';

export const getWishlist     = () => axiosInstance.get('/api/wishlist');
export const toggleWishlist  = (productId) => axiosInstance.post(`/api/wishlist/${productId}/toggle`);