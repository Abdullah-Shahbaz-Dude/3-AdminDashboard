import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import api from "../../utils/api";
import "../css/UserDashboard.css";

const UserDashboard = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["userDashboard", token],
    queryFn: () =>
      api.get(`/api/user-dashboard/validate/${token}`).then((res) => res.data),
  });

  if (isLoading) return <ClipLoader color="#007bff" size={50} />;
  if (error || !data?.success) {
    navigate("/");
    return null;
  }

  const { user } = data;

  return (
    <div className="user-dashboard">
      <h1>Welcome, {user.name}!</h1>
      <p>Your assigned workbooks below:</p>
      <div className="workbooks-container">
        {user.workbooks.length === 0 ? (
          <p>No workbooks assigned.</p>
        ) : (
          <div className="workbooks-grid">
            {user.workbooks.map((wb) => (
              <div key={wb._id}>
                <p>{wb.title}</p>
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
