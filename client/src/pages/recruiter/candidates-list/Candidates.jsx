import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function CandidatesList() {
  const [applications, setApplications] = useState([]);
  const loggedUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchCandidates = async (id) => {
    try {
      const response = await applicationApi.get(`/recruiter/${id}`);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  useEffect(() => {
    if (loggedUser?._id) {
      fetchCandidates(loggedUser._id);
    }
  }, [loggedUser]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Applicants
      </h2>

      <div className="grid gap-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="flex items-center justify-between bg-white rounded-xl shadow-md p-5 border border-gray-200"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {app.candidateId?.username}
              </h3>

              <p className="text-gray-600 text-sm">{app.jobId?.title}</p>

              <p
                className={`text-sm font-medium mt-2 ${
                  app.status === "Pending"
                    ? "text-yellow-600"
                    : app.status === "Rejected"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                Status: {app.status}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/recruiter/candidates-list/${app._id}`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
