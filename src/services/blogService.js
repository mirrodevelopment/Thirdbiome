import getApiClient from "../axios/axios";

// Get all blogs from dynamic API
export const getBlogs = async (params = {}) => {
    try {
        const apiClient = await getApiClient();
        const response = await apiClient.get("/blog", { params });

        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch blogs");
        }
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw error;
    }
};

// Get single blog by ID or slug if supported
export const getBlogBySlug = async (slug) => {
    try {
        const apiClient = await getApiClient();
        const response = await apiClient.get(`/blog/${slug}`);

        if (response.data.success) {
            return response.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch blog");
        }
    } catch (error) {
        console.error("Error fetching blog details:", error);
        throw error;
    }
};
