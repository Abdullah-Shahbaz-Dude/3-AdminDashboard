import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FixedSizeList } from "react-window";
import useStore from "../../store/v3/store";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import api from "../../utils/api";
import Button from "./Button";
import "../css/AssignWorkbooks.css";

const fetchData = async (userId) => {
  const [workbooks, user] = await Promise.all([
    api.get("/api/workbooks").then((res) => res.data),
    api.get(`/api/user-dashboard/users/${userId}`).then((res) => res.data),
  ]);
  return { workbooks, user };
};

const AssignWorkSheets = () => {
  const { selected, setSelected, setLinkVisible, setUser, setUsers } =
    useStore();
  const { userId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["workbooksAndUser", userId],
    queryFn: () => fetchData(userId),
  });

  const handleSelection = useCallback(
    (id) => {
      setSelected(
        selected.includes(id)
          ? selected.filter((i) => i !== id)
          : [...selected, id]
      );
    },
    [selected, setSelected]
  );

  const assignWorkbooks = useCallback(async () => {
    if (!data?.user) {
      toast.error("No user found.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Please select at least one workbook.");
      return;
    }
    try {
      const response = await api.patch(
        `/api/user-dashboard/users/${data.user._id}/assign-workbooks`,
        { workbookIds: selected }
      );
      const { user: updatedUser } = response.data;
      setSelected([]);
      setLinkVisible(true);
      setUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u._id === updatedUser._id ? updatedUser : u))
      );
      toast.success("Workbooks assigned!");
      navigate(`/user-link/${updatedUser._id}`, { replace: true });
    } catch (err) {
      // Handled by axios interceptor
    }
  }, [
    data,
    selected,
    setSelected,
    setLinkVisible,
    setUser,
    setUsers,
    navigate,
  ]);

  if (isLoading) return <ClipLoader color="#007bff" size={50} />;
  if (error || !data?.user)
    return <div>Error loading data or user not found</div>;

  const { workbooks, user } = data;

  const Row = ({ index, style }) => (
    <div style={style} className="workbook-item">
      <input
        type="checkbox"
        checked={selected.includes(workbooks[index]._id)}
        onChange={() => handleSelection(workbooks[index]._id)}
        aria-label={`Select ${workbooks[index].title}`}
      />
      {workbooks[index].title}
    </div>
  );

  return (
    <div className="assign-workbooks-container">
      <h3>Assign Workbooks to {user.name}</h3>
      <FixedSizeList
        height={400}
        width="100%"
        itemCount={workbooks.length}
        itemSize={50}
      >
        {Row}
      </FixedSizeList>
      <Button onClick={assignWorkbooks}>Assign Workbooks</Button>
    </div>
  );
};

export default AssignWorkSheets;
