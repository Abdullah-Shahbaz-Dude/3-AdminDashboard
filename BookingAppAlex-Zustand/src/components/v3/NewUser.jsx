import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useStore from "../../store/v3/store";
import { toast } from "react-toastify";
import api from "../../utils/api";
import FormInput from "./FormInput";
import Button from "./Button";
import "../css/NewUser.css";

const NewUser = () => {
  const { setUser, setUsers } = useStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const createUser = async (data) => {
    try {
      const response = await api.post("/api/user-dashboard/users", data);
      const { user } = response.data;
      setUser(user);
      setUsers((prev) => [...prev, user]);
      toast.success("User created successfully!");
      navigate(`/assign-workbooks/${user._id}`);
    } catch (error) {
      // Handled by axios interceptor
    }
  };

  return (
    <div className="new-user-container">
      <h1>Create User</h1>
      <form onSubmit={handleSubmit(createUser)}>
        <FormInput
          register={register}
          name="name"
          errors={errors}
          placeholder="Name"
          rules={{ required: "Name is required" }}
        />
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
        <Button type="submit">Create User</Button>
      </form>
    </div>
  );
};

export default NewUser;
