import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function AppliedJobs() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      if (!user?._id || !token) return;

      try {
        const res = await applicationApi.get(`/apply/${user._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplications(res.data.applications || []);
      } catch (err) {
        console.error("Fetch Applied Jobs Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user?._id, token]);

  if (!user?._id) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Please login to view applied jobs.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading applied jobs...
      </p>
    );
  }

  if (applications.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        You have not applied to any jobs yet.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
        My Applied Jobs
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {applications.map((app) => {
          const job = app.job;
          const company = app.company;

          return (
            <div
              key={app._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 transition-transform hover:-translate-y-1"
            >
              {/* Job Title + Company */}
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {job?.title}
              </h3>

              <p className="text-gray-600 mb-3">
                <span className="font-medium">Company:</span>{" "}
                {company?.companyName || "N/A"}
              </p>

              {/* ✅ STATUS BADGE (FIXED) */}
              <div className="mb-3">
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium
                    ${
                      app.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : app.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : app.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {app.status}
                </span>
              </div>

              {/* Other Details */}
              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Applied On:</span>{" "}
                  {new Date(app.createdAt).toLocaleDateString()}
                </p>

                {job?.location && (
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {job.location}
                  </p>
                )}

                {job?.salary && (
                  <p>
                    <span className="font-medium">Salary:</span>{" "}
                    {job.salary}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() =>
                  navigate(`/candidate/CompanyAboutCard/${company?._id}`)
                }
                className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl
                hover:bg-blue-700 transition-all font-medium shadow-sm"
              >
                View Company
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
