import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { userApi, companyApi } from "../../../api/api";

const initialValue = {
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [recruiterId, setRecruiterId] = useState(null);

  // Fetch company AFTER recruiter login
  useEffect(() => {
    if (!recruiterId) return;

    const fetchCompany = async () => {
      try {
        const res = await companyApi.get(`/recruiter/${recruiterId}`);
        const comp = res.data?.data || res.data;

        if (!comp) {
          navigate("/recruiter/company/registration");
        } else {
          navigate("/recruiter/home");
        }
      } catch {
        navigate("/recruiter/company/registration");
      }
    };

    fetchCompany();
  }, [recruiterId, navigate]);

  const submitHandler = async (values, { setFieldError }) => {
    try {
      const response = await userApi.post("/login", values);

      const user = response.data.user;

      if (!user) {
        return setFieldError("email", "Login failed");
      }

      // ✅ Save user in redux (NO TOKEN)
      dispatch(loginSuccess(user));

      // ✅ Role-based navigation
      if (user.role === "candidate") {
        navigate("/candidate/home");
      } else if (user.role === "recruiter") {
        setRecruiterId(user._id);
      } else {
        navigate("/admin/home");
      }
    } catch (error) {
      setFieldError("email", "Invalid email or password");
    }
  };

  const { handleChange, handleSubmit, handleReset, values, errors } =
    useFormik({
      initialValues: initialValue,
      onSubmit: submitHandler,
    });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={values.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <NavLink to="/login/register" className="text-blue-600 font-medium">
            Create Account
          </NavLink>
        </p>

        <Outlet />
      </div>
    </div>
  );
}
