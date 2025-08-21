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
  const { user, setUser, setLinkVisible } = useStore();
  const [copied, setCopied] = useState(false);
  const { userId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () =>
      api.get(`/api/user-dashboard/users/${userId}`).then((res) => res.data),
  });
  // console.log(data);

  if (isLoading) return <ClipLoader color="#007bff" size={50} />;
  if (!data) return <div>User not found</div>;

  if (!user || user._id !== data._id) {
    setUser(data);
    setLinkVisible(true);
  }

  const navigateToNewUser = () => navigate("/new-user");

  const copyToClipboard = () => {
    if (!user) return;
    const link = `${import.meta.env.VITE_API_URL}/user-dashboard/${user.accessToken}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="user-link">
      <p>
        User access link:{" "}
        <a
          href={`/user-dashboard/${user.accessToken}`}
          target="_blank"
          rel="noopener noreferrer"
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
