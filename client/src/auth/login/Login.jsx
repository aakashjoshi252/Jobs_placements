import { useFormik } from "formik";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { loginSuccess } from "../../redux/slices/authSlice";
import { userApi, companyApi } from "../../api/api";

const initialValue = {
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values, { setFieldError }) => {
    setLoading(true);
    try {
      const res = await userApi.post("/login", values, {
        withCredentials: true,
      });

      const user = res.data.user;
      if (!user) {
        setFieldError("email", "Login failed");
        return;
      }

      dispatch(loginSuccess(user));

      if (user.role === "candidate") {
        navigate("/candidate/home");
      }

      if (user.role === "recruiter") {
        try {
          const companyRes = await companyApi.get(
            `/recruiter/${user._id}`,
            { withCredentials: true }
          );

          const company = companyRes.data?.data || companyRes.data;
          navigate(
            company
              ? "/recruiter/home"
              : "/recruiter/company/registration"
          );
        } catch {
          navigate("/recruiter/company/registration");
        }
      }

      if (user.role === "admin") {
        navigate("/admin");
      }
    } catch (err) {
      setFieldError("email", "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const { handleChange, handleSubmit, values, errors } = useFormik({
    initialValues: initialValue,
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "Email is required";
      if (!values.password) errors.password = "Password is required";
      return errors;
    },
    onSubmit: submitHandler,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Welcome Back
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
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.email ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.password ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white
              ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
              transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <NavLink to="/login/register" className="text-blue-600 font-medium hover:underline">
            Create Account
          </NavLink>
        </p>

        <Outlet />
      </div>
    </div>
  );
}
