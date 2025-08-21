import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import { useLocation } from "react-router-dom";

import FormInput from "./FormInput";
import Button from "./Button";
import "../css/workbookForm.css";
import useStore from "../../store/v3/store";

const WorkbookForm = ({ workbook, submitUrl, onSubmit }) => {
  const [answers, setAnswers] = useState({});
  const location = useLocation();

  const isUserView = location.pathname.startsWith("/user-dashboard/workbook/");
  // const { user } = useStore;

  useEffect(() => {
    if (workbook) {
      const initialAnswers = {};
      workbook.questions.forEach((_, i) => {
        initialAnswers[i] = "";
      });
      setAnswers(initialAnswers);
    }
  }, [workbook]);

  const handleChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await api.post(submitUrl, {
          workbookId: workbook?._id,
          answers: Object.entries(answers).map(([index, answer]) => ({
            questionIndex: Number(index),
            answer,
          })),
        });
        toast.success("Answers submitted!");
        onSubmit?.();
      } catch (error) {
        // Handled by axios interceptor
      }
    } else {
      console.log("creater user before submission");
    }
  };

  if (!workbook) return <div>Loading...</div>;

  return (
    <div className="workbook-form">
      <h1>{workbook.title}</h1>
      <p>{workbook.description}</p>
      <h2>Reflection Questions</h2>
      <form onSubmit={handleSubmit}>
        {workbook.questions.map((q, idx) => (
          <div key={idx} className="question-container">
            <label htmlFor={`question-${idx}`} className="question-label">
              {q.question || q.text}
            </label>
            <FormInput
              register={() => ({
                onChange: (e) => handleChange(idx, e.target.value),
                value: answers[idx] || "",
              })}
              name={`question-${idx}`}
              errors={{}}
              type={q.answerType === "number" ? "number" : "textarea"}
              placeholder="Enter your answer"
              rules={{ required: "Answer is required" }}
              rows={6} // optional, makes it taller
              cols={60}
            />
          </div>
        ))}
        {isUserView && <Button type="submit">Submit Answers</Button>}
      </form>
    </div>
  );
};

export default WorkbookForm;
