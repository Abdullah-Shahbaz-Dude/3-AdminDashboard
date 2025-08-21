import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { FixedSizeList } from "react-window";
import useStore from "../../store/v3/store";
import { toast } from "react-toastify";
import api from "../../utils/api";
import Button from "./Button";
import "../css/user.css";

const UserCard = ({ user, onDelete }) => (
  <div className="user-card">
    <div className="user-info">
      <p>
        <span>{user.name}</span> - {user.email} ({user.workbooks?.length || 0}{" "}
        Workbooks)
      </p>
      {user.workbooks?.length > 0 && (
        <ul className="workbooks-list">
          {user.workbooks.map((wb) => (
            <li key={wb._id}>{wb.title}</li>
          ))}
        </ul>
      )}
    </div>
    <Button className="delete-btn" onClick={() => onDelete(user._id)}>
      Delete
    </Button>
  </div>
);

const UsersList = () => {
  const { users, setUsers } = useStore();
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/admin/users").then((res) => res.data.users || []),
  });

  useEffect(() => {
    if (data) setUsers(data);
  }, [data, setUsers]);

  const handleDelete = useCallback(
    async (userId) => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      try {
        await api.delete(`/admin/users/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
        toast.success("User deleted successfully!");
      } catch (err) {
        // Handled by axios interceptor
      }
    },
    [users, setUsers]
  );

  if (isLoading) return <p>Loading users...</p>;
  if (!Array.isArray(users) || users.length === 0) return <p>No users found</p>;

  const Row = ({ index, style }) => (
    <div style={style}>
      <UserCard user={users[index]} onDelete={handleDelete} />
    </div>
  );

  return (
    <div className="users-container">
      <h2>All Users</h2>
      <FixedSizeList
        height={400}
        width="100%"
        itemCount={users.length}
        itemSize={100}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
};

export default UsersList;
