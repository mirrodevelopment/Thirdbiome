import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  profileLoading: false,
  error: null,
};

// Helper to map backend data to frontend field names
const mapUserData = (userData) => {
  if (!userData) return null;

  const addr = userData.address || {};

  return {
    ...userData,
    id: userData.id || userData._id,
    firstName: userData.first_name || userData.firstName || "",
    lastName: userData.last_name || userData.lastName || "",
    phoneNumber: userData.phone || userData.phoneNumber || userData.phone_number || "",
    email: userData.email || "",
    address: {
      street: addr.street || userData.street || userData.address_line1 || userData.address || "",
      city: addr.city || userData.city || "",
      state: addr.state || userData.state || userData.province || "",
      zipCode: addr.zipCode || addr.zip_code || userData.zip_code || userData.zipCode || userData.postcode || "",
      country: addr.country || userData.country || "USA",
    }
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;

      // Robust extraction for registration
      const payload = action.payload.data || action.payload;
      const token = payload.token || action.payload.token;

      if (token) {
        state.isAuthenticated = true;

        const rawUserData = payload.user || (payload.id || payload._id ? payload : {});
        state.user = mapUserData(rawUserData);
        state.token = token;
        localStorage.setItem("token", token);
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      }
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;

      // Robust user data extraction: check for 'data' wrapper, 'user' wrapper or direct properties
      const payload = action.payload.data || action.payload;
      const payloadUser = payload.user || {};
      const directProps = payload.id || payload._id ? payload : {};

      const rawUserData = { ...directProps, ...payloadUser };
      const token = payload.token || action.payload.token;

      state.user = mapUserData(rawUserData);
      state.token = token;
      localStorage.setItem("token", token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      // Clear persisted state
      localStorage.removeItem("persist:auth");
    },
    clearError: (state) => {
      state.error = null;
    },
    // Profile related actions
    updateProfileStart: (state) => {
      state.profileLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.profileLoading = false;

      state.user = { ...state.user, ...action.payload.user };
    },
    updateProfileFailure: (state, action) => {
      state.profileLoading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state, action) => {
      if (action.payload && action.payload.auth) {
        if (action.payload.auth.user && action.payload.auth.user.address) {
          // No console logging
        }
      }
    });
  },
});

export const {
  registerStart,
  registerSuccess,
  registerFailure,
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
} = authSlice.actions;

export default authSlice.reducer;
