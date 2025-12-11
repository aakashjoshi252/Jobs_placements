  import { useFormik } from "formik";
  import { regisSchema } from "../../schema/index";
  import { NavLink,useNavigate} from "react-router-dom";
  import {userApi} from "../../../api/api"
  
  const initialValue = {
    username: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    checkbox: false,
  };

  export default function Register() {
    const navigate=useNavigate();
    const submitHandler = async (values, { resetForm }) => {
      try {
        const response= await userApi.post("/user/register/",values);
        console.log("Form submitted:", values);
        alert("Registration Successful!");
        resetForm();
        navigate(`/login`);
      } catch (error) {
        console.log(error);
      }
    };
    const { values, errors, touched, handleChange, handleSubmit, handleBlur, handleReset, } = useFormik({
      initialValues: initialValue,
      onSubmit: submitHandler,
      validationSchema: regisSchema,
    });



  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
    <div className="w-full max-w-md bg-white mt-10 shadow-lg rounded-xl p-8">
      
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Register</h2>

      <form onSubmit={handleSubmit}>

        {/* Username */}
        <label htmlFor="username" className="block font-medium mb-1">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter Username"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.username && touched.username && (
          <p className="text-red-500 text-sm mb-3">{errors.username}</p>
        )}

        {/* Email */}
        <label htmlFor="email" className="block font-medium mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter Email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.email && touched.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email}</p>
        )}

        {/* Password */}
        <label htmlFor="password" className="block font-medium mb-1">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete="false"
          className="w-full p-2 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.password && touched.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password}</p>
        )}

        {/* Phone */}
        <label htmlFor="phone" className="block font-medium mb-1">Phone</label>
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder="Enter Phone/Mobile"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {errors.phone && touched.phone && (
          <p className="text-red-500 text-sm mb-3">{errors.phone}</p>
        )}

        {/* Role */}
        <label htmlFor="role" className="block font-medium mb-1">Select Role</label>
        <select
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-2 border border-gray-300 rounded-md mb-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Select Role</option>
          <option value="candidate">Candidate</option>
          <option value="recruiter">Recruiter</option>
        </select>
        {errors.role && touched.role && (
          <p className="text-red-500 text-sm mb-3">{errors.role}</p>
        )}

        {/* Checkbox */}
        <div className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            id="checkbox"
            name="checkbox"
            checked={values.checkbox}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-4 w-4"
          />
          <label htmlFor="checkbox" className="font-medium">Accept Terms</label>
        </div>
        {errors.checkbox && touched.checkbox && (
          <p className="text-red-500 text-sm mb-3">{errors.checkbox}</p>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-5">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
          >
            Submit
          </button>

          <button
            type="reset"
            onClick={handleReset}
            className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
        </div>

        {/* Footer */}
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
