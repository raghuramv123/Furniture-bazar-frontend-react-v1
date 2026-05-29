import axiosInstance from './axiosInstance';

export const getProducts = (params) => axiosInstance.get('/api/products', { params });
export const getProductBySlug = (slug) => axiosInstance.get(`/api/products/${slug}`);
export const getFeaturedProducts = () => axiosInstance.get('/api/products/featured');
export const createProduct = (data) => axiosInstance.post('/api/products', data);
export const updateProduct = (id, data) => axiosInstance.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => axiosInstance.delete(`/api/products/${id}`);