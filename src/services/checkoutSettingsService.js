import { supabase, isSupabaseConfigured } from "./supabaseClient";

export const CHECKOUT_SETTINGS_STORAGE_KEY = "t3b_checkout_settings";
export const CHECKOUT_SETTINGS_EVENT = "t3b_checkout_settings_updated";

export const DEFAULT_CHECKOUT_SETTINGS = {
  isCodEnabled: true,
  codFee: 0,
  minCodAmount: 0,
  maxCodAmount: 50000,
  codNotice: "Pay in cash or UPI at your doorstep when your package arrives.",
  codUnavailableNotice: "Cash on delivery is temporarily unavailable.",
  enableCodEmailNotification: true,
  codNotificationRecipient: "Info@aeobiome.com",
};

/**
 * Fetch current checkout & payment settings.
 * Checks Supabase first if configured, then localStorage, then default fallback.
 */
export const getCheckoutSettings = async () => {
  // 1. Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("checkout_settings")
        .select("*")
        .eq("id", "default")
        .single();

      if (!error && data) {
        const parsed = {
          isCodEnabled: data.is_cod_enabled ?? true,
          codFee: Number(data.cod_fee) || 0,
          minCodAmount: Number(data.min_order_amount) || 0,
          maxCodAmount: Number(data.max_order_amount) || 50000,
          codNotice: data.cod_notice || DEFAULT_CHECKOUT_SETTINGS.codNotice,
          codUnavailableNotice: DEFAULT_CHECKOUT_SETTINGS.codUnavailableNotice,
          enableCodEmailNotification: data.enable_cod_email_notification ?? true,
          codNotificationRecipient:
            data.cod_notification_recipient || DEFAULT_CHECKOUT_SETTINGS.codNotificationRecipient,
        };
        // Cache to local storage
        try {
          localStorage.setItem(CHECKOUT_SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
        } catch { /* ignore */ }
        return parsed;
      }
    } catch (err) {
      console.warn("Could not load checkout settings from Supabase, checking local cache:", err);
    }
  }

  // 2. Read from localStorage cache
  try {
    const cached = localStorage.getItem(CHECKOUT_SETTINGS_STORAGE_KEY);
    if (cached) {
      return { ...DEFAULT_CHECKOUT_SETTINGS, ...JSON.parse(cached) };
    }
  } catch { /* ignore */ }

  // 3. Fallback to default
  return { ...DEFAULT_CHECKOUT_SETTINGS };
};

/**
 * Save updated checkout settings (Admin action).
 */
export const saveCheckoutSettings = async (settings) => {
  const merged = { ...DEFAULT_CHECKOUT_SETTINGS, ...settings };

  // 1. Save to localStorage immediately
  try {
    localStorage.setItem(CHECKOUT_SETTINGS_STORAGE_KEY, JSON.stringify(merged));
    // Dispatch custom event for real-time reactivity in the same window
    window.dispatchEvent(
      new CustomEvent(CHECKOUT_SETTINGS_EVENT, { detail: merged })
    );
  } catch (err) {
    console.error("Failed to save checkout settings to localStorage:", err);
  }

  // 2. Save to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        id: "default",
        is_cod_enabled: Boolean(merged.isCodEnabled),
        cod_fee: Number(merged.codFee) || 0,
        min_order_amount: Number(merged.minCodAmount) || 0,
        max_order_amount: Number(merged.maxCodAmount) || 50000,
        cod_notice: String(merged.codNotice || ""),
        enable_cod_email_notification: Boolean(merged.enableCodEmailNotification),
        cod_notification_recipient: String(merged.codNotificationRecipient || "Info@aeobiome.com"),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("checkout_settings")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        console.warn("Failed to update checkout settings in Supabase:", error);
      }
    } catch (err) {
      console.warn("Supabase checkout settings update error:", err);
    }
  }

  return merged;
};

/**
 * Helper to check if COD can be used for a given order total.
 */
export const checkCodEligibility = (settings, orderTotal) => {
  if (!settings || !settings.isCodEnabled) {
    return {
      eligible: false,
      reason: settings?.codUnavailableNotice || "Cash on Delivery is currently disabled.",
    };
  }

  const total = Number(orderTotal) || 0;
  if (settings.minCodAmount > 0 && total < settings.minCodAmount) {
    return {
      eligible: false,
      reason: `Cash on Delivery is only available for orders of ₹${settings.minCodAmount} or more.`,
    };
  }

  if (settings.maxCodAmount > 0 && total > settings.maxCodAmount) {
    return {
      eligible: false,
      reason: `Cash on Delivery is only available for orders up to ₹${settings.maxCodAmount}.`,
    };
  }

  return { eligible: true, fee: Number(settings.codFee) || 0 };
};

export default {
  getCheckoutSettings,
  saveCheckoutSettings,
  checkCodEligibility,
  DEFAULT_CHECKOUT_SETTINGS,
};
