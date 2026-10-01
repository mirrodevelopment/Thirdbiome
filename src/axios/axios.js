import axios from "axios";

const getToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token !== null) {
      const authorization = `${token}`;
      return authorization;
    }
    return null;
  } catch (err) {
    // Error handling can be added here if needed
  }
};

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://admin.thirdbiome.com/api/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

const getApiClient = async () => {
  const token = await getToken();
  instance.defaults.headers.common["x-auth-token"] = token;
  return instance;
};

export default getApiClient;
