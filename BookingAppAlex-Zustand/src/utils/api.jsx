import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    console.log("Request URL:", config.url);
    if (["post", "patch", "delete"].includes(config.method.toLowerCase())) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/csrf-token`,
          { withCredentials: true }
        );
        console.log("CSRF Token:", response.data.csrfToken);
        config.headers["X-CSRF-Token"] = response.data.csrfToken;
      } catch (error) {
        console.error("CSRF Token Error:", error);
        toast.error("Failed to fetch CSRF token");
        return Promise.reject(error);
      }
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response.data);
    return response;
  },
  (error) => {
    let message = "An error occurred. Please try again.";
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = error.response.data.message || "Invalid input provided.";
          break;
        case 401:
          message = error.response.data.message || "Session expired. Please log in again.";
          // Skip redirect for /api/user-dashboard/validate and /api/user-dashboard/workbook
          if (
            !error.config.url.includes("/api/user-dashboard/validate") &&
            !error.config.url.includes("/api/user-dashboard/workbook")
          ) {
            window.location.href = "/admin";
          }
          break;
        case 403:
          message = error.response.data.message || "You don't have permission to perform this action.";
          break;
        case 404:
          message = error.response.data.message || "Resource not found.";
          break;
        case 429:
          message = error.response.data.message || "Too many requests. Please try again later.";
          break;
        case 500:
          message = error.response.data.message || "Server error. Please try again later.";
          break;
        default:
          message = error.response.data.message || message;
      }
    } else if (error.message === "Network Error") {
      message = "Network error. Please check your connection.";
    }

    console.error("Response Error:", error.response?.data || error.message);
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;