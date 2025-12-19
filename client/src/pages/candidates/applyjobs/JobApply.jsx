// JobApply.jsx
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JobApply() {
  const navigate = useNavigate();

  // ================= REDUX STATE =================
  const LoggedUser = useSelector((state) => state.auth.user);
  const resume = useSelector((state) => state.resume.data);
  const { data: job, loading: jobLoading, error } = useSelector(
    (state) => state.job
  );

  // ================= LOCAL STATE =================
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= SAFE IDS =================
  const jobId = job?._id;
  const companyId = job?.companyId?._id || job?.companyId;
  const recruiterId = job?.recruiterId?._id || job?.recruiterId;
  const resumeId = resume?._id;

  // ================= APPLY HANDLER =================
  const handleApply = async () => {
    if (!LoggedUser) {
      return navigate("/login");
    }

    if (!jobId || !resumeId || !recruiterId) {
      alert("Missing required application details");
      return navigate(`/candidate/CompanyAboutCard/${companyId}`);
    }

    const applicationData = {
      jobId,
      candidateId: LoggedUser._id,
      recruiterId,
      resumeId,
      companyId,
      coverLetter,
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

  // ================= UI STATES =================
  if (jobLoading)
    return <p className="text-center mt-12">Loading job...</p>;

  if (error)
    return (
      <p className="text-center text-red-600 mt-12">
        {error}
      </p>
    );

  if (!job)
    return <p className="text-center mt-12">Job not found</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Apply for Job
      </h2>

      {/* ================= JOB INFO ================= */}
      <div className="bg-gray-100 p-4 rounded-lg mb-4 border">
        <p className="text-gray-700">
          <strong>Job Title:</strong> {job.title}
        </p>
        <p className="text-gray-700">
          <strong>Company:</strong>{" "}
          {job?.companyId?.companyName || "-"}
        </p>
      </div>

      {/* ================= CANDIDATE INFO ================= */}
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

      {/* ================= COVER LETTER ================= */}
      <textarea
        placeholder="Write cover letter (optional)"
        value={coverLetter}
        onChange={(e) => setCoverLetter(e.target.value)}
        className="w-full p-3 h-32 border rounded-lg mb-6 resize-none focus:ring-2 focus:ring-blue-500"
      />

      {/* ================= BUTTONS ================= */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-lg bg-gray-600 text-white font-medium hover:bg-gray-700 transition"
        >
          Back
        </button>

        <button
          onClick={handleApply}
          disabled={loading || !resumeId || !LoggedUser}
          className={`w-full py-3 rounded-lg text-white font-medium transition
            ${
              loading || !resumeId || !LoggedUser
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {loading ? "Applying..." : "Apply Now"}
        </button>
      </div>
    </div>
  );
}
