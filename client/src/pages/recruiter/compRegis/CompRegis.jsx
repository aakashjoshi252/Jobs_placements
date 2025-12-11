import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { companyApi } from "../../../../api/api";
import { companyValidation } from "../../../schema/index";

const companyInitialValues = {
  uploadLogo: null,
  companyName: "",
  industry: "",
  size: "",
  establishedYear: "",
  website: "",
  location: "",
  description: "",
  contactEmail: "",
  contactNumber: "",
};

export default function CompanyRegistration() {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const loggedUser = useSelector((state) => state.auth.user);
  const recruiterId = loggedUser?._id;

  // ---------------- SUBMIT HANDLER ----------------
  const submithandler = async (values, { setSubmitting }) => {
    try {
      setApiError("");

      if (!recruiterId) {
        alert("Please login as recruiter first!");
        return;
      }

      const formData = new FormData();

      // File field
      if (values.uploadLogo) {
        formData.append("uploadLogo", values.uploadLogo);
      }

      // Append rest fields except file
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "uploadLogo") {
          formData.append(key, value);
        }
      });

      formData.append("recruiterId", recruiterId);

      await companyApi.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Company registration successful!");
      localStorage.setItem("companyRegistered", "true");
      navigate("/recruiter/home/");

    } catch (error) {
      setApiError(error.response?.data?.message || "Something went wrong, please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- FORMIK ----------------
  const formik = useFormik({
    initialValues: companyInitialValues,
    validationSchema: companyValidation,
    onSubmit: submithandler,
  });

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8 border border-gray-200">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Company Registration Form
        </h2>

        <form onSubmit={formik.handleSubmit} noValidate className="space-y-5">

          {/* LOGO UPLOAD */}
          <div>
            <label className="font-medium text-gray-700">Upload Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => formik.setFieldValue("uploadLogo", e.target.files[0])}
              className="mt-1 w-full p-3 rounded-lg border border-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.touched.uploadLogo && formik.errors.uploadLogo && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.uploadLogo}</p>
            )}
          </div>

          {/* TEXT FIELDS */}
          {[
            { label: "Company Name", name: "companyName", type: "text" },
            { label: "Established Year", name: "establishedYear", type: "number" },
            { label: "Website", name: "website", type: "url" },
            { label: "Head Office Location", name: "location", type: "text" },
            { label: "Contact Email", name: "contactEmail", type: "email" },
            { label: "Contact Number", name: "contactNumber", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formik.values[field.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`mt-1 w-full p-3 rounded-lg border ${
                  formik.touched[field.name] && formik.errors[field.name]
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {formik.touched[field.name] && formik.errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</p>
              )}
            </div>
          ))}

          {/* INDUSTRY */}
          <div>
            <label className="font-medium text-gray-700">Industry Type</label>
            <select
              name="industry"
              value={formik.values.industry}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 w-full p-3 rounded-lg border ${
                formik.touched.industry && formik.errors.industry
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">-- Select Industry --</option>
              <option value="Goldsmith">Goldsmith</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Diamond">Diamond</option>
              <option value="Silver">Silver</option>
            </select>
            {formik.touched.industry && formik.errors.industry && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.industry}</p>
            )}
          </div>

          {/* SIZE */}
          <div>
            <label className="font-medium text-gray-700">Company Size</label>
            <select
              name="size"
              value={formik.values.size}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 w-full p-3 rounded-lg border ${
                formik.touched.size && formik.errors.size
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            >
              <option value="">-- Select Size --</option>
              <option value="1-10">1–10</option>
              <option value="11-50">11–50</option>
              <option value="51-200">51–200</option>
              <option value="201-500">201–500</option>
              <option value="500+">500+</option>
            </select>
            {formik.touched.size && formik.errors.size && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.size}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium text-gray-700">Company Description</label>
            <textarea
              name="description"
              rows="4"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`mt-1 w-full p-3 rounded-lg border ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
            )}
          </div>

          {/* API ERROR */}
          {apiError && (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Submit
            </button>

            <button
              type="button"
              onClick={formik.handleReset}
              className="w-full bg-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
