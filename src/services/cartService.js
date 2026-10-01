import getApiClient from "../axios/axios";
import { store } from "../redux/Store";
import { setCart, setLoading, setError } from "../redux/slices/CartSlice";
import { showToast } from "../utils/toast";
import { formatImageUrl } from "../utils/urlUtils";

// Get session ID for anonymous users
const getSessionId = () => {
  const sessionId = localStorage.getItem("sessionId");
  return sessionId;
};

// Generate and store session ID
export const generateSessionId = async () => {
  const apiClient = await getApiClient();
  const response = await apiClient.post("/cart/session");
  const sessionId = response.data.data.sessionId;
  localStorage.setItem("sessionId", sessionId);
  return sessionId;
};

// Get cart
export const getCart = async () => {
  // eslint-disable-next-line no-useless-catch
  try {
    const apiClient = await getApiClient();
    const sessionId = getSessionId();
    const headers = {
      "x-session-id": sessionId,
    };

    const response = await apiClient.get("/cart", { headers });

    // Handle backend response structure
    // Laravel API returns: { success: true, data: { id, customerId, sessionId, items: [...] } }
    const rawItems = response.data.data?.items || [];
    const validationErrors = response.data.data?.validationErrors || [];
    const cartUpdated = response.data.data?.cartUpdated || false;

    // Normalize items from API format to frontend format
    // API item: { id, cartId, productId, variantId, quantity, product: { name, images, variants, imageUrls } }
    // Frontend needs: { variantId, productId, name, price, image, quantity, ... }
    let cartItems = rawItems.map((item) => {
      const product = item.product || {};
      const variants = product.variants || [];

      // Try to find the matching variant for price
      let variantPrice = 0;
      let variantName = "";
      const itemVariantId = item.variantId || item.id;

      if (variants.length > 0) {
        // If item has a variantId, try to find matching variant
        const matchedVariant = variants.find(
          (v) =>
            v._id === itemVariantId ||
            v.id === itemVariantId ||
            v.name === itemVariantId
        );
        if (matchedVariant) {
          variantPrice = parseFloat(matchedVariant.price) || 0;
          variantName = matchedVariant.name || "";
        } else {
          // Fallback to first variant
          variantPrice = parseFloat(variants[0].price) || 0;
          variantName = variants[0].name || "";
        }
      }

      // Get the best image URL using formatImageUrl utility
      const imageUrl = formatImageUrl(
        product.imageUrls?.[0] || product.images?.[0] || "/src/assets/imageTest.webp"
      );

      return {
        ...item,
        id: item.id, // Preserve the database record ID for Laravel
        variantId: itemVariantId,
        productId: item.productId || product.id,
        name: product.name || "Product",
        price: variantPrice,
        image: imageUrl,
        selectedPlan: variantName,
        stock: undefined,
      };
    });

    // Process validation errors to mark items with stock issues
    const itemsWithStockStatus = cartItems.map((item) => {
      // Find validation errors for this item
      const itemVariantId = item.variantId?.toString() || "";
      const itemProductId = item.productId?.toString() || "";
      const itemErrors = validationErrors.filter(
        (error) =>
          (error.variantId &&
            error.variantId.toString() === itemVariantId) ||
          (error.productId &&
            error.productId.toString() === itemProductId)
      );

      const hasOutOfStockError = itemErrors.some(
        (error) => error.type === "out_of_stock"
      );
      const hasInsufficientStockError = itemErrors.some(
        (error) => error.type === "insufficient_stock"
      );

      // Get available stock from error details
      const stockError = itemErrors.find(
        (error) =>
          error.type === "insufficient_stock" || error.type === "out_of_stock"
      );

      // Also check for other error types that indicate product/variant issues
      const hasProductError = itemErrors.some(
        (error) =>
          error.type === "product_not_found" ||
          error.type === "variant_not_found"
      );

      return {
        ...item,
        isOutOfStock: hasOutOfStockError || hasProductError,
        hasStockIssue:
          hasOutOfStockError || hasInsufficientStockError || hasProductError,
        availableStock:
          stockError?.availableStock !== undefined
            ? stockError.availableStock
            : null,
        validationErrors: itemErrors,
      };
    });

    // Show notification if cart was updated (items were removed)
    if (cartUpdated) {
      showToast.info(
        "Some items were removed from your cart due to product changes"
      );
    }

    // Show validation error messages with better categorization
    if (validationErrors.length > 0) {
      const outOfStockCount = validationErrors.filter(
        (e) => e.type === "out_of_stock"
      ).length;
      const insufficientStockCount = validationErrors.filter(
        (e) => e.type === "insufficient_stock"
      ).length;
      const productNotFoundCount = validationErrors.filter(
        (e) => e.type === "product_not_found"
      ).length;
      const variantNotFoundCount = validationErrors.filter(
        (e) => e.type === "variant_not_found"
      ).length;

      // Show notifications for different types of validation issues
      if (outOfStockCount > 0) {
        showToast.warning(
          `${outOfStockCount} item(s) in your cart are now out of stock`
        );
      }
      if (insufficientStockCount > 0) {
        showToast.warning(
          `${insufficientStockCount} item(s) in your cart have stock limitations`
        );
      }
      if (productNotFoundCount > 0) {
        showToast.error(
          `${productNotFoundCount} product(s) in your cart are no longer available`
        );
      }
      if (variantNotFoundCount > 0) {
        showToast.error(
          `${variantNotFoundCount} variant(s) in your cart are no longer available`
        );
      }
    }

    store.dispatch(setCart(itemsWithStockStatus));

    return response.data;
  } catch (error) {
    // Handle error appropriately
    throw error;
  }
};

// Add item to cart
export const addToCart = async (variantId, productId, quantity = 1) => {
  try {
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));

    // Stock validation removed for performance

    const apiClient = await getApiClient();
    let sessionId = getSessionId();

    // Generate session ID if not exists
    if (!sessionId) {
      sessionId = await generateSessionId();
    }

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const payload = { productId, variantId, quantity };

    const response = await apiClient.post("/cart", payload, { headers });

    // After adding to cart, refresh the cart to get updated data with validation
    await getCart();

    return response.data;
  } catch (error) {
    // Check if it's a stock-related error or API error
    if (error.response?.status === 400 && error.response?.data?.message) {
      const apiErrorMessage = error.response.data.message;
      if (
        apiErrorMessage.toLowerCase().includes("stock") ||
        apiErrorMessage.toLowerCase().includes("out of stock") ||
        apiErrorMessage.toLowerCase().includes("inventory")
      ) {
        store.dispatch(setError(apiErrorMessage));
        throw new Error(apiErrorMessage);
      }
    }

    // Use the error message if it's already a stock error
    if (error.message && error.message.includes("stock")) {
      throw error;
    }

    store.dispatch(setError("Failed to add to cart"));
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Update cart item quantity
export const updateCartItemQuantity = async (cartItemId, quantity) => {
  try {
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));

    // Stock validation removed for performance

    const apiClient = await getApiClient();
    let sessionId = getSessionId();

    if (!sessionId) {
      sessionId = await generateSessionId();
    }

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const response = await apiClient.put(
      `/cart/${cartItemId}`,
      { quantity },
      { headers }
    );

    // After updating cart item, refresh the cart to get updated data with validation
    await getCart();

    return response.data;
  } catch (error) {
    // Check if it's a stock-related error from API
    if (error.response?.status === 400 && error.response?.data?.message) {
      const apiErrorMessage = error.response.data.message;
      if (
        apiErrorMessage.toLowerCase().includes("stock") ||
        apiErrorMessage.toLowerCase().includes("out of stock") ||
        apiErrorMessage.toLowerCase().includes("inventory")
      ) {
        store.dispatch(setError(apiErrorMessage));
        throw new Error(apiErrorMessage);
      }
    }

    // Use the error message if it's already a stock error
    if (error.message && error.message.includes("stock")) {
      throw error;
    }

    store.dispatch(setError("Failed to update cart"));
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Remove item from cart
export const removeFromCart = async (cartItemId) => {
  try {
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));

    const apiClient = await getApiClient();
    let sessionId = getSessionId();

    // Generate session ID if not exists
    if (!sessionId) {
      sessionId = await generateSessionId();
    }

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const response = await apiClient.delete(`/cart/${cartItemId}`, {
      headers,
    });

    // After removing cart item, refresh the cart to get updated data
    await getCart();

    return response.data;
  } catch (error) {
    store.dispatch(setError("Failed to remove item"));
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));

    const apiClient = await getApiClient();
    let sessionId = getSessionId();

    // Generate session ID if not exists
    if (!sessionId) {
      sessionId = await generateSessionId();
    }

    const headers = {};
    if (sessionId) {
      headers["x-session-id"] = sessionId;
    }

    const response = await apiClient.post("/cart/clear", {}, { headers });

    // Update Redux store with empty cart
    store.dispatch(setCart([]));

    return response.data;
  } catch (error) {
    store.dispatch(setError("Failed to clear cart"));
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};

// Merge carts (when user logs in)
export const mergeCarts = async () => {
  try {
    store.dispatch(setLoading(true));
    store.dispatch(setError(null));

    const apiClient = await getApiClient();
    const sessionId = getSessionId();

    if (!sessionId) {
      throw new Error("No session ID found");
    }

    const response = await apiClient.post(
      "/cart/merge",
      {},
      {
        headers: { "x-session-id": sessionId },
      }
    );

    // Re-hydrate the cart with normalized items (getCart applies the full
    // API→frontend mapping, so subtotal/name/image survive the merge).
    await getCart();

    return response.data;
  } catch (error) {
    store.dispatch(setError("Failed to merge carts"));
    throw error;
  } finally {
    store.dispatch(setLoading(false));
  }
};
