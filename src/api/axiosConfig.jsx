import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.example.com", // Replace with your actual API base URL
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
