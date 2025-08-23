import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import WorkbookForm from "./WorkbookForm";
import { ClipLoader } from "react-spinners";

const WorkbookDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["workbook", id],
    queryFn: async () => {
      const res = await api.get(`/api/workbooks/${id}`);
      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to fetch workbook");
      }
      return res.data.workbook; // ✅ only return the workbook
    },
  });
  if (isLoading) return <ClipLoader color="#007bff" size={50} />;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No workbook found</div>;
  return (
    <WorkbookForm
      workbook={data}
      submitUrl={`${import.meta.env.VITE_API_URL}/api/workbooks/${id}/submit`}
    />
  );
};

export default WorkbookDetail;
