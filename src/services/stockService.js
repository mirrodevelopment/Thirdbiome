import getApiClient from "../axios/axios";

// Get stock information for a product variant
export const getStock = async (variantId) => {
  try {
    const apiClient = await getApiClient();
    const response = await apiClient.get(`/stock/${variantId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check if a variant is in stock for a specific quantity
export const checkStockAvailability = async (variantId, quantity = 1) => {
  try {
    const stockData = await getStock(variantId);
    const availableStock = stockData.data?.stock || 0;

    return {
      available: availableStock >= quantity,
      stock: availableStock,
      requestedQuantity: quantity,
    };
  } catch (error) {
    // If there's an error fetching stock, assume it's available to avoid blocking cart
    return {
      available: true,
      stock: null,
      requestedQuantity: quantity,
      error: true,
    };
  }
};
