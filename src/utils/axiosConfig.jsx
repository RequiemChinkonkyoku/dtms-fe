import axios from "axios";

// Create an Axios instance
const instance = axios.create({
  baseURL: "https://localhost:7288", // Replace with your API base URL
});

// Get the token from localStorage (don't use useState here)
const token = localStorage.getItem("token"); // Ensure the token is correctly stored

// Set the Authorization header if the token exists
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Optionally, use an interceptor to dynamically attach or update the token before each request
instance.interceptors.request.use(
  (config) => {
    const updatedToken = localStorage.getItem("token"); // Re-fetch the token if it may change
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
