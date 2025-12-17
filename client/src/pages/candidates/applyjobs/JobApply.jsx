// JobApply.jsx
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobApply() {
  const navigate = useNavigate();

  const LoggedUser = useSelector((state) => state.auth.user);
  const resume = useSelector((state) => state.resume.data);
  console.log("Resume in JobApply:", resume._id);

  const job = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("selectedJob"));
    } catch {
      return null;
    }
  })();

  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const jobId = job?._id;
  const companyId = job?.companyId?._id || job?.companyId;
  const recruiterId = job?.recruiterId?._id || job?.recruiterId;
  const resumeId = resume?._id?._id || resume._id;

  const handleApply = async () => {
    if (!jobId || !LoggedUser?._id || !resume?._id || !recruiterId) {
      alert("Missing required application details");
      return navigate(`/candidate/CompanyAboutCard/${companyId}`);
    }

    const applicationData = {
      jobId,
      candidateId: LoggedUser._id,
      recruiterId,
      resumeId: resumeId,
      companyId,
      coverLetter, // optional (safe even if backend ignores)
    };

    try {
      setLoading(true);
      await applicationApi.post("/apply", applicationData);
      alert("Application Submitted Successfully!");
      navigate("/candidate/applications/list");
    } catch (error) {
      console.error("Apply Error:", error);
      alert(error?.response?.data?.message || "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Apply for Job
      </h2>

      {/* Job Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
        <p className="text-gray-700">
          <strong>Job Title:</strong> {job?.title || "-"}
        </p>
        <p className="text-gray-700">
          <strong>Company:</strong> {job?.companyId?.companyName || "-"}
        </p>
      </div>

      {/* Candidate Info */}
      <input
        type="text"
        value={LoggedUser?.username || ""}
        readOnly
        className="w-full p-3 mb-3 border rounded-lg bg-gray-100"
      />

      <input
        type="email"
        value={LoggedUser?.email || ""}
        readOnly
        className="w-full p-3 mb-3 border rounded-lg bg-gray-100"
      />

      <input
        type="text"
        value={resume?.phone || "Not Provided"}
        readOnly
        className="w-full p-3 mb-3 border rounded-lg bg-gray-100"
      />

      {/* Cover Letter */}
      <textarea
        placeholder="Write cover letter (optional)"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        className="w-full p-3 h-32 border rounded-lg mb-4 resize-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={loading || !resume?._id}
        className={`w-full py-3 rounded-lg text-white font-medium transition
          ${
            loading || !resume?._id
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }
        `}
      >
        {loading ? "Applying..." : "Apply Now"}
      </button>
    </div>
  );
}
