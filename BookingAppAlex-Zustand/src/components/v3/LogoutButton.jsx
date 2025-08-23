import { useNavigate } from "react-router-dom";
import useStore from "../../store/v3/store";
import { toast } from "react-toastify";
import Button from "./Button";
import api from "../../utils/api"; // make sure api is imported

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser, setLinkVisible } = useStore();

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout"); // Backend clears the cookie
      setUser(null);
      setLinkVisible(false);
      toast.success("Logged out successfully!");
      navigate("/admin", { replace: true });
    } catch (error) {
      // Handled by axios interceptor
      console.error("Logout failed", error);
    }
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
