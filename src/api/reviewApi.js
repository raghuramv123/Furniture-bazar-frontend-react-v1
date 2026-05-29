import axiosInstance from './axiosInstance';

export const getReviews   = (productId) => axiosInstance.get(`/api/reviews/product/${productId}`);
export const getRating    = (productId) => axiosInstance.get(`/api/reviews/product/${productId}/rating`);
export const addReview    = (productId, data) => axiosInstance.post(`/api/reviews/product/${productId}`, data);
export const deleteReview = (reviewId) => axiosInstance.delete(`/api/reviews/${reviewId}`);