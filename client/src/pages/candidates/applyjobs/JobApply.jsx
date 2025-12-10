// JobApply.jsx
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobApply() {
  const navigate = useNavigate();
  const LoggedUser = useSelector((state) => state.auth.user);

  const safeParse = (v) => {
    try {
      return JSON.parse(v);
    } catch (e) {
      return null;
    }
  };

  const job = safeParse(localStorage.getItem("selectedJob"));
  const resume = safeParse(localStorage.getItem("resume"));

  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const jobId = job?._id;
  const companyId = job?.companyId?._id || job?.companyId;

  const handleApply = async () => {
    if (!jobId || !LoggedUser?._id || !resume?._id) {
      alert("Missing job details or resume!");
      return navigate(`/candidate/CompanyAboutCard/${companyId}`);
    }

    setLoading(true);

    const applicationData = {
      jobId,
      candidateId: LoggedUser._id,
      resumeId: resume._id,
      coverLetter,
    };

    try {
      await applicationApi.post("/apply", applicationData);
      alert("Application Submitted Successfully!");
      navigate("/candidate/applications/list");
    } catch (err) {
      console.log("Application Error:", err);
      alert(
        err?.response?.data?.message || "Error applying for the job."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="apply-job-form max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border">
    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Apply for Job</h2>

    <div className="apply-info-box bg-gray-100 p-4 rounded-lg mb-4 border">
      <p className="text-gray-700 mb-1">
        <strong className="font-medium">Job Title:</strong> {job?.title}
      </p>
      <p className="text-gray-700">
        <strong className="font-medium">Company:</strong> {job?.companyId?.companyName}
      </p>
    </div>

    <input
      type="text"
      value={LoggedUser?.username || ""}
      readOnly
      className="w-full p-3 mb-3 border rounded-lg bg-gray-100 text-gray-700"
    />

    <input
      type="email"
      value={LoggedUser?.email || ""}
      readOnly
      className="w-full p-3 mb-3 border rounded-lg bg-gray-100 text-gray-700"
    />

    <input
      type="text"
      value={LoggedUser?.phone || 'Not Provided'}
      readOnly
      className="w-full p-3 mb-3 border rounded-lg bg-gray-100 text-gray-700"
    />

    <textarea
      placeholder="Write cover letter (optional)"
      value={coverLetter}
      onChange={(e) => setCoverLetter(e.target.value)}
      className="w-full p-3 h-32 border rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={handleApply}
      disabled={loading || !resume?._id}
      className={`
        w-full py-3 rounded-lg text-white font-medium transition 
        ${loading || !resume?._id 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700"}
      `}
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  </div>
);

}
