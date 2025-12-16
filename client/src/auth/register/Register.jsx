import { useFormik } from "formik";
import { regisSchema } from "../../schema/index";
import { NavLink, useNavigate } from "react-router-dom";
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

  const submitHandler = async (values, { resetForm, setFieldError }) => {
    try {
      const payload = {
        username: values.username, 
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
      };  

      await userApi.post("/register", payload);

      alert("Registration Successful!");
      resetForm();
      navigate("/login");

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Registration failed";

      setFieldError("email", msg);
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    handleReset,
  } = useFormik({
    initialValues: initialValue,
    onSubmit: submitHandler,
    validationSchema: regisSchema,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white mt-10 shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label className="block font-medium mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md mb-1"
          />
          {errors.username && touched.username && (
            <p className="text-red-500 text-sm mb-3">{errors.username}</p>
          )}

          {/* Email */}
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md mb-1"
          />
          {errors.email && touched.email && (
            <p className="text-red-500 text-sm mb-3">{errors.email}</p>
          )}

          {/* Password */}
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md mb-1"
          />
          {errors.password && touched.password && (
            <p className="text-red-500 text-sm mb-3">{errors.password}</p>
          )}

          {/* Phone */}
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md mb-1"
          />
          {errors.phone && touched.phone && (
            <p className="text-red-500 text-sm mb-3">{errors.phone}</p>
          )}

          {/* Role */}
          <label className="block font-medium mb-1">Select Role</label>
          <select
            name="role"
            value={values.role}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md mb-1"
          >
            <option value="">Select Role</option>
            <option value="candidate">Candidate</option>
            <option value="recruiter">Recruiter</option>
          </select>
          {errors.role && touched.role && (
            <p className="text-red-500 text-sm mb-3">{errors.role}</p>
          )}

          {/* Terms (frontend only) */}
          <div className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              name="checkbox"
              checked={values.checkbox}
              onChange={handleChange}
            />
            <label className="font-medium">Accept Terms</label>
          </div>
          {errors.checkbox && touched.checkbox && (
            <p className="text-red-500 text-sm mb-3">{errors.checkbox}</p>
          )}

          {/* Buttons */}
          <div className="flex justify-between mt-5">
            <button className="bg-blue-600 text-white px-5 py-2 rounded-md">
              Submit
            </button>
            <button
              type="reset"
              onClick={handleReset}
              className="bg-gray-500 text-white px-5 py-2 rounded-md"
            >
              Reset
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <NavLink to="/login" className="text-blue-600 font-semibold">
                Login here
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}