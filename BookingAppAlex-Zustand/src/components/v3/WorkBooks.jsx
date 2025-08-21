import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FixedSizeList } from "react-window";
import { ClipLoader } from "react-spinners";
import api from "../../utils/api";
import "../css/Workbooks.css";

const WorkbookCard = ({ workbook, onClick }) => (
  <div className="workbook-card" onClick={onClick}>
    <h3>{workbook.title}</h3>
    <p>{workbook.description}</p>
  </div>
);

const WorkBooks = () => {
  const navigate = useNavigate();
  const { data: workbooks, isLoading } = useQuery({
    queryKey: ["workbooks"],
    queryFn: () => api.get("/api/workbooks").then((res) => res.data),
  });

  if (isLoading) return <ClipLoader color="#007bff" size={50} />;

  const Row = ({ index, style }) => (
    <div style={style}>
      <WorkbookCard
        workbook={workbooks[index]}
        onClick={() => navigate(`/workbook/${workbooks[index]._id}`)}
      />
    </div>
  );

  return (
    <div className="workbooks-container">
      <h1>All Workbooks</h1>
      <FixedSizeList
        height={400}
        width="100%"
        itemCount={workbooks?.length || 0}
        itemSize={100}
      >
        {Row}
      </FixedSizeList>
    </div>
  );
};

export default WorkBooks;
