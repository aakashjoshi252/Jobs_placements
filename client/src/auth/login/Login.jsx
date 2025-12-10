import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import { userApi, companyApi } from "../../../api/api";

const initialValue = {
  role: "",
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [company, setCompany] = useState(null);
  const [recruiterId, setRecruiterId] = useState(null);

  // Fetch company AFTER recruiter logs in
  useEffect(() => {
    if (recruiterId) {
      const fetchCompany = async () => {
        try {
          const res = await companyApi.get(`/recruiter/${recruiterId}`);
          const comp = res.data?.data || res.data;
          setCompany(comp);

          if (!comp) {
            navigate("/recruiter/company/registration");
          } else {
            navigate("/recruiter/home");
          }
        } catch (err) {
          navigate("/recruiter/company/registration");
        }
      };
      fetchCompany();
    }
  }, [recruiterId]);

  const submitHandler = async (values, { setFieldError }) => {
    try {
      const response = await userApi.post(`/user/login/`, values);
      const foundUser = response.data.data;

      if (!foundUser) return alert("User not found");

      dispatch(loginSuccess(foundUser));

      if (foundUser.role === "candidate") {
        return navigate("/candidate/home");
      }

      if (foundUser.role === "recruiter") {
        setRecruiterId(foundUser._id);
        return;
      }

      navigate("/admin/home");
    } catch (error) {
      setFieldError("email", "Invalid credentials");
    }
  };

  const { handleChange, handleSubmit, handleReset, values, errors } = useFormik({
    initialValues: initialValue,
    onSubmit: submitHandler,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md shadow-xl rounded-2xl p-8">

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={values.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            >
              <option value="">Select Role</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
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
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={values.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
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

        {/* Bottom Link */}
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
