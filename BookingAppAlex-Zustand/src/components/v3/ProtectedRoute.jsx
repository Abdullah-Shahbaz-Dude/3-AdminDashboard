import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../../utils/api";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  console.log(token);

  const { data, isLoading } = useQuery({
    queryKey: ["validateToken"],
    queryFn: () => api.get("/admin/validate").then((res) => res.data),
    retry: false,
  });
  console.log(data);

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

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

  if (!data?.valid) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
