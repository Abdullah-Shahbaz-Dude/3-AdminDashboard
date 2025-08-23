import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FixedSizeList } from "react-window";
import { ClipLoader } from "react-spinners";
import api from "../../utils/api";
import "../css/Workbooks.css";

const WorkbookCard = ({ workbook, onClick }) => (
  <div className="workbook-card" onClick={onClick}>
    <h3>{workbook.title || "Untitled Workbook"}</h3>
    <p>{workbook.description || "No description available"}</p>
  </div>
);

const WorkBooks = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery({
    queryKey: ["workbooks"],
    queryFn: async () => {
      const response = await api.get("/api/workbooks");
      console.log("Workbooks API response:", response.data); // Debug log
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch workbooks");
      }
      return response.data.workbooks || [];
    },
  });

  if (isLoading) {
    return (
      <div className="loading-container">
        <ClipLoader color="#007bff" size={50} aria-label="Loading" />
      </div>
    );
  }

  if (error) {
    console.error("Workbooks query error:", error); // Debug log
    return <div className="error-container">Error: {error.message}</div>;
  }

  if (!data) {
    console.log("No workbooks data received"); // Debug log
    return <div className="error-container">No workbooks data available</div>;
  }

  console.log("Workbooks data:", data); // Debug log

  const Row = ({ index, style }) => {
    console.log(`Rendering workbook at index ${index}:`, data[index]); // Debug log
    return (
      <div style={style} className="workbook-row">
        <WorkbookCard
          workbook={data[index]}
          onClick={() => {
            console.log("Navigating to workbook:", data[index]._id); // Debug log
            navigate(`/workbook/${data[index]._id}`);
          }}
        />
      </div>
    );
  };

  return (
    <div className="workbooks-container">
      <h1>All Workbooks</h1>
      {data.length === 0 ? (
        <p>No workbooks available</p>
      ) : (
        <FixedSizeList
          height={400}
          width="100%"
          itemCount={data.length}
          itemSize={120}
        >
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
};

export default WorkBooks;
