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
        const { token } = response.data;
        if (!token) {
          toast.error("Login failed: No token received");
          return;
        }
        localStorage.setItem("token", token);
        toast.success("Login successful! Redirecting...");
        navigate("/dashboard");
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
      <form onSubmit={handleSubmit(handleSubmitForm)}>
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
