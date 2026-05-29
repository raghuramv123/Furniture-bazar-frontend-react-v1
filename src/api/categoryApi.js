import axiosInstance from "./axiosInstance";

export const getCategories = () => axiosInstance.get("/api/categories");
export const getCategoryChildren = (id) =>
  axiosInstance.get(`/api/categories/${id}/children`);
