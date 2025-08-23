import { useCallback } from "react";
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
  const [workbooksResponse, userResponse] = await Promise.all([
    api.get("/api/workbooks").then((res) => res.data),
    api.get(`/api/user-dashboard/users/${userId}`).then((res) => res.data),
  ]);
  console.log("Workbooks response:", workbooksResponse); // Debug log
  console.log("User response:", userResponse); // Debug log
  if (!workbooksResponse.success || !userResponse.success) {
    throw new Error(
      workbooksResponse.message ||
        userResponse.message ||
        "Failed to fetch data"
    );
  }
  return {
    workbooks: workbooksResponse.workbooks || [],
    userData: userResponse.user || null,
  };
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

  console.log("Store state:", { selected, setUser, setUsers }); // Debug log
  console.log("Query data:", data); // Debug log

  const handleSelection = useCallback(
    (id) => {
      console.log("Selecting workbook:", id); // Debug log
      setSelected(
        selected.includes(id)
          ? selected.filter((i) => i !== id)
          : [...selected, id]
      );
    },
    [selected, setSelected]
  );

  const assignWorkbooks = useCallback(async () => {
    if (!data?.userData) {
      toast.error("No user found.");
      return;
    }
    if (selected.length === 0) {
      toast.error("Please select at least one workbook.");
      return;
    }
    try {
      const response = await api.patch(
        `/api/user-dashboard/users/${data.userData._id}/assign-workbooks`,
        { workbookIds: selected }
      );
      console.log("Assign workbooks response:", response.data); // Debug log
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to assign workbooks");
      }
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
      console.error("Assign workbooks error:", err); // Debug log
      toast.error(err.message || "Failed to assign workbooks");
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#007bff" size={50} aria-label="Loading" />
      </div>
    );
  }

  if (error || !data) {
    console.error("Query error:", error); // Debug log
    return (
      <div className="error-container">
        Error: {error?.message || "Unable to load user or workbooks"}
      </div>
    );
  }

  const { workbooks, userData } = data;

  const Row = ({ index, style }) => (
    <div style={style} className="workbook-item">
      <input
        type="checkbox"
        checked={selected.includes(workbooks[index]._id)}
        onChange={() => handleSelection(workbooks[index]._id)}
        aria-label={`Select ${workbooks[index].title || "Untitled Workbook"}`}
      />
      <span>{workbooks[index].title || "Untitled Workbook"}</span>
    </div>
  );

  return (
    <div className="assign-workbooks-container">
      <h3>Assign Workbooks to {userData?.name || "User"}</h3>
      {workbooks.length === 0 ? (
        <p>No workbooks available</p>
      ) : (
        <FixedSizeList
          height={400}
          width="100%"
          itemCount={workbooks.length}
          itemSize={50}
        >
          {Row}
        </FixedSizeList>
      )}
      <Button onClick={assignWorkbooks}>Assign Workbooks</Button>
    </div>
  );
};

export default AssignWorkSheets;
