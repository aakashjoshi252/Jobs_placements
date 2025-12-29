import { useFormik } from "formik";
import { regisSchema } from "../../schema";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { userApi } from "../../../api/api";

const initialValue = {
  username: "",
  email: "",
  password: "",
  role: "",
  phone: "",
  checkbox: false,
};

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitHandler = async (values, { resetForm, setFieldError }) => {
    setLoading(true);
    try {
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
      };

      await userApi.post("/register", payload);

      resetForm();
      navigate("/login");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Registration failed";
      setFieldError("email", msg);
    } finally {
      setLoading(false);
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues: initialValue,
    onSubmit: submitHandler,
    validationSchema: regisSchema,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.username && touched.username ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.username && touched.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.email && touched.email ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.password && touched.password ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.phone && touched.phone ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.phone && touched.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block font-medium mb-1">Select Role</label>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg p-2.5 bg-gray-50 border
                ${errors.role && touched.role ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select Role</option>
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
            {errors.role && touched.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="checkbox"
              checked={values.checkbox}
              onChange={handleChange}
              className="accent-blue-600"
            />
            <label className="text-sm font-medium">
              I accept the Terms & Conditions
            </label>
          </div>
          {errors.checkbox && touched.checkbox && (
            <p className="text-red-500 text-sm">{errors.checkbox}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !values.checkbox}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition
              ${loading || !values.checkbox
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 font-medium hover:underline">
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
}
