import { useNavigate } from "react-router-dom";
import useStore from "../../store/v3/store";
import { toast } from "react-toastify";
import Button from "./Button";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser, setLinkVisible } = useStore();

  const handleLogout = () => {
    setUser(null);
    setLinkVisible(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/admin", { replace: true });
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
