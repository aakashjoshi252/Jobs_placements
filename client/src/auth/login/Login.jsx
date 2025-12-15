import { useFormik } from "formik";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess} from "../../redux/slices/authSlice";
import { userApi, companyApi } from "../../../api/api";

const initialValue = {
  email: "",
  password: "",
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (values, { setFieldError }) => {
    try {
      // ✅ Cookie-based login
      const res = await userApi.post("/login", values, {
        withCredentials: true,
      });

      const user = res.data.user;
      if (!user) {
        return setFieldError("email", "Login failed");
      }

      // ✅ Store user ONLY (NO TOKEN)
      dispatch(loginSuccess(user));

      // ✅ Role-based redirect
      if (user.role === "candidate") {
        navigate("/candidate/home");
      }

      if (user.role === "recruiter") {
        // check company
        try {
          const companyRes = await companyApi.get(
            `/recruiter/${user._id}`,
            { withCredentials: true }
          );

          const company = companyRes.data?.data || companyRes.data;

          if (!company) {
            navigate("/recruiter/company/registration");
          } else {
            navigate("/recruiter/home");
          }
        } catch {
          navigate("/recruiter/company/registration");
        }
      }

      if (user.role === "admin") {
        navigate("/admin/home");
      }

    } catch (err) {
      setFieldError("email", "Invalid email, password or role");
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

          {/* Role */}
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">
              Role
            </label>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            >
              <option value="candidate">Candidate</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div> */}

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 bg-gray-50"
            />
          </div>

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold"
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
