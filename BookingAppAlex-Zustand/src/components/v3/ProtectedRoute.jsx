import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { jwtDecode } from "jwt-decode";
import api from "../../utils/api";

const ProtectedRoute = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["validateToken"],
    queryFn: async () => {
      try {
        const response = await api.get("/admin/validate");
        if (response.data.success && response.data.token) {
          const decoded = jwtDecode(response.data.token);
          if (decoded.exp * 1000 < Date.now()) {
            return { success: false, message: "Token expired" };
          }
          return response.data;
        }
        return { success: false, message: "Invalid response" };
      } catch (error) {
        console.error("Token Validation Error:", error);
        return { success: false, message: "Validation failed" };
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="#007bff" size={50} aria-label="Loading" />
      </div>
    );
  }

  if (!data?.success) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
