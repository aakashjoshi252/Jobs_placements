import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { jobsApi } from "../../../../../api/api"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
  companyName: "",
  companyEmail: "",
  companyAddress: "",
};

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  console.log(jobId)

  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.data);

  const [jobData, setJobData] = useState(null);

  //  Fetch Job Details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsApi.get(`/${jobId}`);
        const job = res.data;

        setJobData({
          ...job,
          skills: job.skills?.join(", "),
        });
      } catch (error) {
        alert("Failed to load job details");
      }
    };

    fetchJob();
  }, [jobId]);

  const formik = useFormik({
    initialValues: jobData || {
      ...initialValues,
      recruiterId: user?._id || "",
      companyId: company?._id || "",
      companyName: company?.companyName || "",
      companyEmail: company?.contactEmail || "",
      companyAddress: company?.location || "",
    },
    enableReinitialize: true,

    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          skills: values.skills
            ? values.skills.split(",").map((s) => s.trim())
            : [],
        };

        await jobsApi.put(`/${jobId}`, payload);

        alert("Job updated successfully!");
        navigate("/recruiter/home");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to update job");
      }
    },
  });

  if (!company) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold text-gray-800">
          No Company Found
        </h2>
        <button
          onClick={() => navigate("/recruiter/company/registration")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          Register Your Company
        </button>
      </div>
    );
  }

  if (!jobData) {
    return <div className="text-center mt-10">Loading job details...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Job</h2>

     <form onSubmit={formik.handleSubmit} className="space-y-4">

  {/* Job Title */}
  <div>
    <label className="block font-medium text-gray-700">Job Title</label>
    <input
      type="text"
      name="title"
      value={formik.values.title}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
    />
  </div>

  {/* Description */}
  <div>
    <label className="block font-medium text-gray-700">Job Description</label>
    <textarea
      name="description"
      value={formik.values.description}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg h-28 resize-none"
    />
  </div>

  {/* Location */}
  <div>
    <label className="block font-medium text-gray-700">Location</label>
    <input
      type="text"
      name="jobLocation"
      value={formik.values.jobLocation}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
    />
  </div>

  {/* Job Type */}
  <div>
    <label className="block font-medium text-gray-700">Job Type</label>
    <select
      name="jobType"
      value={formik.values.jobType}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
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
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
    >
      <option value="Full-time">Full-time</option>
      <option value="Part-time">Part-time</option>
      <option value="Contract">Contract</option>
      <option value="Hourly">Hourly</option>
    </select>
  </div>

  {/* Experience */}
  <div>
    <label className="block font-medium text-gray-700">Experience Level</label>
    <select
      name="experience"
      value={formik.values.experience}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
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
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
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
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
    />
  </div>

  {/* Deadline */}
  <div>
    <label className="block font-medium text-gray-700">Application Deadline</label>
    <input
      type="date"
      name="deadline"
      value={formik.values.deadline}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
    />
  </div>

  {/* Skills */}
  <div>
    <label className="block font-medium text-gray-700">
      Required Skills (comma separated)
    </label>
    <input
      type="text"
      name="skills"
      placeholder="React, Node, MongoDB"
      value={formik.values.skills}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg"
    />
  </div>

  {/* Additional Requirements */}
  <div>
    <label className="block font-medium text-gray-700">
      Additional Requirements
    </label>
    <textarea
      name="additionalRequirement"
      value={formik.values.additionalRequirement}
      onChange={formik.handleChange}
      className="w-full border border-gray-300 px-3 py-2 rounded-lg h-24 resize-none"
    />
  </div>

  {/* Buttons */}
  <div className="flex gap-4 mt-4">
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
    >
      Update Job
    </button>

    <button
      type="button"
      onClick={() => navigate(-1)}
      className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
    >
      Cancel
    </button>
  </div>
</form>

    </div>
  );
}
