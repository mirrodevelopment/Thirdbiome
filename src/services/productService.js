import getApiClient from "../axios/axios";

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get("/products", { params });

    // Handle the new API response structure
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch products");
    }
  } catch (error) {
    throw error;
  }
};

// Get single product by ID
export const getProduct = async (productId) => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get(`/products/${productId}`);

    // Handle the new API response structure
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch product");
    }
  } catch (error) {
    throw error;
  }
};

// Search products
export const searchProducts = async (query, limit = 10) => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get("/products/search", {
      params: { q: query, limit },
    });

    // Handle the new API response structure
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to search products");
    }
  } catch (error) {
    throw error;
  }
};

// Get product categories
export const getCategories = async () => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get("/products/categories");

    // Handle the new API response structure
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch categories");
    }
  } catch (error) {
    throw error;
  }
};
