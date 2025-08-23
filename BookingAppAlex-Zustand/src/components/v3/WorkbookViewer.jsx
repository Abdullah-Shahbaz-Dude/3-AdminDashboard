import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../../utils/api";
import WorkbookForm from "./WorkbookForm";
import { ClipLoader } from "react-spinners";

const WorkbookViewer = () => {
  const { token, workbookId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["workbook", token, workbookId],
    queryFn: async () => {
      if (!token || !workbookId) {
        throw new Error("Invalid token or workbook ID");
      }
      const response = await api.get(
        `/api/user-dashboard/workbook/${token}/${workbookId}`
      );
      console.log("Workbook fetch response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch workbook");
      }
      return response.data;
    },
    enabled: !!token && !!workbookId,
  });

  if (isLoading) {
    return <ClipLoader color="#007bff" size={50} aria-label="Loading" />;
  }

  // Handle error gracefully
  if (error || !data?.success) {
    return (
      <div className="user-dashboard-error">
        <h2>Invalid or expired workbook link</h2>
        <p>Please go back to your dashboard and try again.</p>
      </div>
    );
  }

  if (!data?.workbook) {
    return null;
  }

  return (
    <WorkbookForm
      workbook={data.workbook}
      submitUrl={`${
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      }/api/workbooks/forms/${data.workbook._id}/submit`}
    />
  );
};

export default WorkbookViewer;
