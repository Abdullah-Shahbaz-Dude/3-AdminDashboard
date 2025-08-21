import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/v3/store";

const UserManagement = () => {
  const { user, linkVisible } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/new-user");
    else if (!linkVisible) navigate(`/assign-workbooks/${user._id}`);
  }, [user, linkVisible, navigate]);

  return null;
};

export default UserManagement;
