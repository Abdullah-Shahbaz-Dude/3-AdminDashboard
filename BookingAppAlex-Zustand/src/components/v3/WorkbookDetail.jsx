import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import WorkbookForm from "./WorkbookForm";

const WorkbookDetail = () => {
  const { id } = useParams();
  const { data: workbook, isLoading } = useQuery({
    queryKey: ["workbook", id],
    queryFn: () => api.get(`/api/workbooks/${id}`).then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <WorkbookForm
      workbook={workbook}
      submitUrl={`${import.meta.env.VITE_API_URL}/api/workbooks/${id}/submit`}
    />
  );
};

export default WorkbookDetail;
