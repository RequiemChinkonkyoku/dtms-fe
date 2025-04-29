import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Get the token from localStorage
const token = localStorage.getItem("token");

// Set the Authorization header if the token exists
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

instance.interceptors.request.use(
  (config) => {
    const updatedToken = localStorage.getItem("token"); // Re-fetch the token
    if (updatedToken) {
      config.headers["Authorization"] = `Bearer ${updatedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
