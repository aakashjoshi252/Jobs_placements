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

  // ================= VALIDATION =================
  const validateApplication = () => {
    if (!LoggedUser) {
      alert("Please login to apply for jobs");
      navigate("/login");
      return false;
    }

    if (!resume || !resumeId) {
      alert("Please create/upload your resume first");
      navigate("/candidate/resume");
      return false;
    }

    if (!LoggedUser.username || LoggedUser.username.trim() === "") {
      alert("Username is required. Please update your profile.");
      return false;
    }

    if (!LoggedUser.email || LoggedUser.email.trim() === "") {
      alert("Email is required. Please update your profile.");
      return false;
    }

    if (!resume.phone || resume.phone.trim() === "") {
      alert("Phone number is required. Please update your resume.");
      navigate("/candidate/resume");
      return false;
    }

    if (!jobId || !recruiterId) {
      alert("Missing job details. Please try again.");
      navigate(`/candidate/CompanyAboutCard/${companyId}`);
      return false;
    }

    return true;
  };

  // ================= APPLY HANDLER =================
  const handleApply = async () => {
    // Validate before submitting
    if (!validateApplication()) return;

    const applicationData = {
      jobId,
      candidateId: LoggedUser._id,
      recruiterId,
      resumeId,
      companyId,
      coverLetter: coverLetter.trim(),
    };

    console.log("Submitting application:", applicationData);

    try {
      setLoading(true);
      const response = await applicationApi.post("/apply", applicationData);
      
      console.log("Application response:", response.data);
      
      alert("Application Submitted Successfully!");
      navigate("/candidate/applications/list");
    } catch (error) {
      console.error("Apply Error:", error);
      
      const errorMessage = 
        error?.response?.data?.message || 
        error?.message || 
        "Failed to apply. Please try again.";
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI STATES =================
  if (jobLoading) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12">
        <p className="text-center text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12">
        <p className="text-center text-red-600 font-medium">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 mx-auto block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12">
        <p className="text-center text-gray-600">Job not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 mx-auto block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Check if user has resume before rendering form
  if (!resume || !resumeId) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-12 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Resume Required
        </h2>
        <p className="text-yellow-700 mb-4">
          You need to create/upload your resume before applying for jobs.
        </p>
        <button
          onClick={() => navigate("/candidate/resume")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Resume
        </button>
      </div>
    );
  }

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
          {job?.companyId?.companyName || "N/A"}
        </p>
      </div>

      {/* ================= CANDIDATE INFO ================= */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={LoggedUser?.username || ""}
          readOnly
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
          placeholder="Your name"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={LoggedUser?.email || ""}
          readOnly
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
          placeholder="your.email@example.com"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={resume?.phone || ""}
          readOnly
          className="w-full p-3 border rounded-lg bg-gray-100 text-gray-700"
          placeholder="Your phone number"
        />
        {!resume?.phone && (
          <p className="text-xs text-red-500 mt-1">
            Please add phone number to your resume
          </p>
        )}
      </div>

      {/* ================= COVER LETTER ================= */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cover Letter (Optional)
        </label>
        <textarea
          placeholder="Write a brief cover letter explaining why you're a good fit for this role..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          className="w-full p-3 h-32 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={1000}
        />
        <p className="text-xs text-gray-500 mt-1">
          {coverLetter.length}/1000 characters
        </p>
      </div>

      {/* ================= VALIDATION WARNINGS ================= */}
      {(!LoggedUser?.username || !LoggedUser?.email || !resume?.phone) && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium mb-1">
            ⚠️ Missing Required Information:
          </p>
          <ul className="text-xs text-yellow-700 list-disc list-inside">
            {!LoggedUser?.username && <li>Username is required</li>}
            {!LoggedUser?.email && <li>Email is required</li>}
            {!resume?.phone && <li>Phone number is required</li>}
          </ul>
        </div>
      )}

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
          disabled={
            loading || 
            !resumeId || 
            !LoggedUser || 
            !LoggedUser.username || 
            !LoggedUser.email || 
            !resume?.phone
          }
          className={`w-full py-3 rounded-lg text-white font-medium transition
            ${
              loading ||
              !resumeId ||
              !LoggedUser ||
              !LoggedUser.username ||
              !LoggedUser.email ||
              !resume?.phone
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
