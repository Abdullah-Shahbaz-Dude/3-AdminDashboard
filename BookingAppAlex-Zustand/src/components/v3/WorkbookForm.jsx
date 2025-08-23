
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import FormInput from "./FormInput";
import sanitizeHtml from "sanitize-html";
import Button from "./Button";
import api from "../../utils/api";
import useStore from "../../store/v3/store";
import "../css/workbookForm.css";

const WorkbookForm = ({ workbook, submitUrl, onSubmit }) => {
  const { user, setUser } = useStore();
  const { token } = useParams();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (token && !user) {
      const fetchUser = async () => {
        try {
          const response = await api.get(`/api/user-dashboard/validate/${token}`);
          console.log("WorkbookForm user fetch response:", response.data); // Debug log
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            toast.error("Invalid or expired token");
          }
        } catch (error) {
          console.error("WorkbookForm user fetch error:", error);
          toast.error("Failed to validate user");
        }
      };
      fetchUser();
    }
  }, [token, user, setUser]);

  const isUserView = location.pathname.startsWith("/user-dashboard/workbook/");

  const onSubmitForm = async (data) => {
    const answers = Object.entries(data).map(([key, value]) => ({
      questionIndex: Number(key.split("-")[1]),
      answer: sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      }),
    }));
    try {
      await api.post(submitUrl, {
        workbookId: workbook?._id,
        answers,
        userName: user?.name || "Unknown User",
      });
      console.log("Form submission response:", { workbookId: workbook._id, answers }); // Debug log
      toast.success("Answers submitted!");
      onSubmit?.();
    } catch (error) {
      console.error("Form submission error:", error); // Debug log
      // Handled by axios interceptor
    }
  };

  if (!workbook) return <div>Loading...</div>;

  return (
    <div className="workbook-form">
      <h1>{workbook.title}</h1>
      <p>{workbook.description}</p>
      <h2>Reflection Questions</h2>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        {workbook.questions?.map((q, idx) => (
          <div key={idx} className="question-container">
            <label htmlFor={`question-${idx}`} className="question-label">
              {q.question || q.text || "Question"}
            </label>
            <FormInput
              register={register}
              name={`question-${idx}`}
              errors={errors}
              type={q.answerType === "number" ? "number" : "textarea"}
              placeholder="Enter your answer"
              rules={{ required: "Answer is required" }}
              rows={6}
              cols={60}
            />
          </div>
        )) || <p>No questions available</p>}
        {isUserView && <Button type="submit">Submit Answers</Button>}
      </form>
    </div>
  );
};

WorkbookForm.propTypes = {
  workbook: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    questions: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string,
        text: PropTypes.string,
        answerType: PropTypes.oneOf(["text", "number"]),
      })
    ),
  }),
  submitUrl: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
};

export default WorkbookForm;
