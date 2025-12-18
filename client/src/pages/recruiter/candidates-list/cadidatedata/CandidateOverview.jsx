import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { applicationApi } from "../../../../../api/api";

export default function CandidateView() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState({});
  const [job, setJob] = useState({});
  const [application, setApplication] = useState({});

  // ---------------- FETCH CANDIDATE DATA ----------------
  const fetchCandidateData = async () => {
    if (!applicationId) return;

    try {
      const res = await applicationApi.get(
        `/candidatedata/${applicationId}`
      );
      setCandidate(res.data.candidateData);
      setJob(res.data.jobData);
      setApplication(res.data.application);
    } catch (err) {
      console.error("Fetch candidate data error:", err);
    }
  };

  useEffect(() => {
    fetchCandidateData();
  }, [applicationId]);

  if (!candidate || !job) {
    return (
      <h2 className="text-center p-6 text-xl text-gray-600">
        Loading candidate data...
      </h2>
    );
  }
return (
  <div className="flex justify-center py-10 px-4 bg-gray-100">
    <div className="w-full max-w-4xl space-y-8">

      {/* ================= CANDIDATE CARD ================= */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-800">
            Candidate Profile
          </h3>

          <button
            onClick={() => navigate(`/recruiter/candidates-list/candidate/${applicationId}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            View Full Profile
          </button>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-3">
          {candidate?.username}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-gray-700">
          <p><strong>Email:</strong> {candidate?.email}</p>
          <p><strong>Phone:</strong> {candidate?.phone || "N/A"}</p>
          <p>
            <strong>Joined:</strong>{" "}
            {candidate?.createdAt
              ? new Date(candidate.createdAt).toLocaleDateString()
              : "N/A"}
          </p>
          <p><strong>Role:</strong> {candidate?.role}</p>
        </div>
      </div>

      {/* ================= JOB DETAILS ================= */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <h3 className="text-xl font-semibold text-gray-800">
          Applied Job
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-700">
          <p><strong>Job Title:</strong> {job?.title}</p>
          <p><strong>Company:</strong> {job?.companyName || "N/A"}</p>
          <p><strong>Location:</strong> {job?.jobLocation || "N/A"}</p>
          <p><strong>Salary:</strong> {job?.salary || "N/A"}</p>
          <p><strong>Experience:</strong> {job?.experience || "N/A"}</p>
        </div>

        <p className="mt-4 text-gray-600">
          <strong>Description:</strong>{" "}
          {job?.description || "No description provided"}
        </p>
      </div>

      {/* ================= APPLICATION DETAILS ================= */}
      <div className="bg-white shadow-lg rounded-2xl p-6 border">
        <h3 className="text-xl font-semibold text-gray-800">
          Application Details
        </h3>

        <div className="space-y-4 mt-4 text-gray-700">
          <p>
            <strong>Status:</strong>
            <span
              className={`ml-3 px-3 py-1 rounded-full text-sm font-semibold
              ${
                application?.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : application?.status === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {application?.status || "PENDING"}
            </span>
          </p>

          <p>
            <strong>Applied On:</strong>{" "}
            {application?.createdAt
              ? new Date(application.createdAt).toLocaleDateString()
              : "N/A"}
          </p>

          <p>
            <strong>Cover Letter:</strong>{" "}
            {application?.coverLetter || "Not provided"}
          </p>
        </div>
      </div>

    </div>
  </div>
);

}
