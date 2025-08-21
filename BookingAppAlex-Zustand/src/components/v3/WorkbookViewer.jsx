import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import WorkbookForm from "./WorkbookForm";

const WorkbookViewer = () => {
  const { token, workbookId } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["workbook", token, workbookId],
    queryFn: () =>
      api
        .get(`/api/user-dashboard/workbook/${token}/${workbookId}`)
        .then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <WorkbookForm
      workbook={data?.workbook}
      submitUrl={`${import.meta.env.VITE_API_URL}/api/workbooks/forms/${data?.workbook?._id}/submit`}
    />
  );
};

export default WorkbookViewer;
