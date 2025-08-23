import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useStore from "../../store/v3/store";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import api from "../../utils/api";
import Button from "./Button";
import "../css/UserLink.css";

const UserLink = () => {
  const navigate = useNavigate();
  const { user: storeUser, setUser, setLinkVisible } = useStore();
  const [copied, setCopied] = useState(false);
  const { userId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await api.get(`/api/user-dashboard/users/${userId}`);
      console.log("User fetch response:", response.data);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user");
      }
      return response.data;
    },
    onError: (err) => {
      console.error("useQuery error:", err);
      if (err.response?.status === 401) {
        toast.error("Session expired. Redirecting to login...");
        navigate("/admin");
      } else {
        navigate("/new-user");
      }
    },
  });

  if (isLoading)
    return <ClipLoader color="#007bff" size={50} aria-label="Loading" />;
  if (error || !data?.success) {
    console.error("User fetch error:", error?.message || data?.message);
    return null;
  }

  const { user } = data;

  if (!user?.accessToken) {
    console.error("No accessToken for user:", user);
    navigate("/new-user");
    return null;
  }

  if (!storeUser || storeUser._id !== user._id) {
    setUser(user);
    setLinkVisible(true);
  }

  const navigateToNewUser = () => navigate("/new-user");

  const copyToClipboard = () => {
    const link = `${
      import.meta.env.VITE_API_URL || "http://localhost:5000"
    }/api/user-dashboard/validate/${user.accessToken}`;
    console.log("Copying link:", link);
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="user-link">
      <p>
        User access link:
        <a
          href={`/user-dashboard/${user.accessToken}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            console.log("Link clicked:", e.target.href); // Debug log
          }}
        >
          Click here
        </a>
      </p>
      <Button onClick={copyToClipboard}>
        {copied ? "Copied!" : "Copy link"}
      </Button>
      <Button onClick={navigateToNewUser}>Create new user</Button>
    </div>
  );
};

export default UserLink;
