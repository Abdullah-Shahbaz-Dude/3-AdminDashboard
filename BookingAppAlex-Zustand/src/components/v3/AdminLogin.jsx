import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import api from "../../utils/api";
import FormInput from "./FormInput";
import Button from "./Button";
import "../css/AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSubmitForm = useCallback(
    debounce(async (data) => {
      setLoading(true);
      try {
        const response = await api.post("/admin/login", data);
        if (response.data.success) {
          toast.success("Login successful! Redirecting...");
          navigate("/dashboard");
        } else {
          toast.error("Login failed");
        }
      } catch (error) {
        // Handled by axios interceptor
      } finally {
        setLoading(false);
      }
    }, 500),
    [navigate]
  );

  return (
    <div className="admin-login-container">
      <h2>Admin Login</h2>
      <form className="admin-login" onSubmit={handleSubmit(handleSubmitForm)}>
        <FormInput
          register={register}
          name="email"
          errors={errors}
          placeholder="Email"
          rules={{
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
          }}
        />
        <FormInput
          register={register}
          name="password"
          errors={errors}
          placeholder="Password"
          type="password"
          rules={{ required: "Password is required" }}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default AdminLogin;
