import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "../css/UserDashboard.css";

const UserDashboard = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["userDashboard", token],
    queryFn: async () => {
      if (!token) throw new Error("No token provided");

      const response = await api.get(`/api/user-dashboard/validate/${token}`);
      console.log("Validate token response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Invalid token");
      }
      return response.data;
    },
    enabled: !!token,
    onError: (err) => {
      console.error("Token validation error:", err.message);
      toast.error(err.message || "Failed to load user data");
    },
  });

  if (isLoading) {
    return <ClipLoader color="#007bff" size={50} aria-label="Loading" />;
  }

  // If invalid token
  if (error || !data?.success) {
    return (
      <div className="user-dashboard-error">
        <h2>Invalid or expired link</h2>
        <p>Please request a new access link.</p>
        <button onClick={() => navigate("/new-user")}>Create New User</button>
      </div>
    );
  }

  const { user } = data;

  return (
    <div className="user-dashboard">
      <h1>Welcome, {user.name || "User"}!</h1>
      <p>Your assigned workbooks below:</p>
      <div className="workbooks-container">
        {user.workbooks.length === 0 ? (
          <p>No workbooks assigned.</p>
        ) : (
          <div className="workbooks-grid">
            {user.workbooks.map((wb) => (
              <div key={wb._id} className="workbook-item">
                <p>{wb.title || "Untitled Workbook"}</p>
                <Link
                  to={`/user-dashboard/workbook/${token}/${wb._id}`}
                  className="workbook-link"
                >
                  Open Workbook
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
