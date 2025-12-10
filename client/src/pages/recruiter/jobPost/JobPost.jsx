import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { jobsApi, companyApi } from "../../../../api/api"; 
import {useSelector} from "react-redux";

const initialValues = {
  title: "",
  description: "",
  jobLocation: "",
  jobType: "On-site",
  empType: "Full-time",
  experience: "Fresher",
  salary: "",
  openings: 1,
  deadline: "",
  skills: "",
  additionalRequirement: "",
  companyId: "",
  recruiterId: "",
};

export default function JobPost() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedUser = useSelector((state) => state.auth.user);
  console.log(company)

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await companyApi.get(`/recruiter/${loggedUser._id}`);
        setCompany(res.data.data);
      } catch (err) {
        console.error("Company fetch failed:", err);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    if (loggedUser?._id) fetchCompany();
  }, [loggedUser]);

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      recruiterId: loggedUser?._id || "",
      companyId: company?._id || "",
      companyName: company?.companyName || "",
      companyEmail: company?.contactEmail || "",
      companyAddress: company?.location || "",
    },
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        setApiError("");

        const payload = {
          ...values,
          skills: values.skills.split(",").map((s) => s.trim()),
        };

        await jobsApi.post("/create", payload);

        alert("Job Posted Successfully!");
        resetForm();
        navigate("/recruiter/home");
      } catch (error) {
        console.error("API error:", error);
        setApiError(error.response?.data?.message || "Something went wrong!");
      }
    },
  });

  if (loading) return <p>Loading company details...</p>;

  if (!company) {
    return (
      <div className="jobpost-container">
        <h2>No Company Found</h2>
        <button onClick={() => navigate("/recruiter/company/registration")}>
          Register Your Company
        </button>
      </div>
    );
  }

  return (
  <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Post a Job</h2>

    <form onSubmit={formik.handleSubmit} className="space-y-4">

      {/* Job Title */}
      <div>
        <label className="block font-medium text-gray-700">Job Title</label>
        <input
          type="text"
          name="title"
          value={formik.values.title}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg h-28 resize-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Location */}
      <div>
        <label className="block font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="jobLocation"
          value={formik.values.jobLocation}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Job Type */}
      <div>
        <label className="block font-medium text-gray-700">Job Type</label>
        <select
          name="jobType"
          value={formik.values.jobType}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* Employment Type */}
      <div>
        <label className="block font-medium text-gray-700">Employment Type</label>
        <select
          name="empType"
          value={formik.values.empType}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Hourly">Hourly</option>
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className="block font-medium text-gray-700">Experience</label>
        <select
          name="experience"
          value={formik.values.experience}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="Fresher">Fresher</option>
          <option value="Junior">Junior</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {/* Salary */}
      <div>
        <label className="block font-medium text-gray-700">Salary</label>
        <input
          type="text"
          name="salary"
          value={formik.values.salary}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Openings */}
      <div>
        <label className="block font-medium text-gray-700">Openings</label>
        <input
          type="number"
          name="openings"
          value={formik.values.openings}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Deadline */}
      <div>
        <label className="block font-medium text-gray-700">Deadline</label>
        <input
          type="date"
          name="deadline"
          value={formik.values.deadline}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="block font-medium text-gray-700">
          Skills (Comma Separated)
        </label>
        <input
          type="text"
          name="skills"
          placeholder="React, Node, MongoDB"
          value={formik.values.skills}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Additional Requirements */}
      <div>
        <label className="block font-medium text-gray-700">
          Additional Requirement
        </label>
        <textarea
          name="additionalRequirement"
          value={formik.values.additionalRequirement}
          onChange={formik.handleChange}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Company Info */}
      <h3 className="text-lg font-semibold text-gray-800 mt-6">
        Company Info (Auto-filled)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={formik.values.companyName}
          disabled
          className="border border-gray-300 px-3 py-2 rounded-lg bg-gray-100"
        />
        <input
          type="email"
          value={formik.values.companyEmail}
          disabled
          className="border border-gray-300 px-3 py-2 rounded-lg bg-gray-100"
        />
        <input
          type="text"
          value={formik.values.companyAddress}
          disabled
          className="border border-gray-300 px-3 py-2 rounded-lg bg-gray-100"
        />
      </div>

      {/* Error */}
      {apiError && (
        <p className="text-red-600 font-medium bg-red-100 px-3 py-2 rounded">
          {apiError}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Post Job
        </button>
        <button
          type="button"
          onClick={() => formik.resetForm()}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>
    </form>
  </div>
);
}
