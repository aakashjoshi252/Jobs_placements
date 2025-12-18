import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function CandidatesList() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loggedUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchCandidates = async () => {
    try {
      const res = await applicationApi.get(`/received/${loggedUser._id}`);
      setApplications(res.data.data || res.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedUser?._id) {
      fetchCandidates();
    }
  }, [loggedUser]);

  if (loading) {
    return (
      <p className="text-center text-lg text-gray-500 mt-10">Loading candidates...</p>
    );
  }

  if (applications.length === 0) {
    return (
      <p className="text-center text-lg text-gray-500 mt-10">
        No candidates have applied yet.
      </p>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "Selected":
      case "Shortlisted":
      case "Reviewed":
        return "text-green-600 bg-green-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Applicants List
      </h2>

      <div className="grid gap-5">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white rounded-xl shadow-md p-5 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {app.candidateId?.username}
              </h3>

              <p className="text-gray-600 text-sm mt-1">
                Applied for:{" "}
                <span className="font-medium">{app.jobId?.title}</span>
              </p>

              <span
                className={`inline-block px-3 py-1 mt-3 rounded-full text-sm font-medium ${getStatusColor(
                  app.status
                )}`}
              >
                {app.status}
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/chatbox')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Message
              </button>

              <button
                onClick={() => navigate(`/recruiter/candidates-list/${app._id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
