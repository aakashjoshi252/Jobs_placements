import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function AppliedJobs() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    if (!user?._id) return;

    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);

        const res = await applicationApi.get(`/applied/${user._id}`);

        const apps =
          res?.data?.applications ||
          res?.data?.data ||
          [];

        setApplications(apps);
      } catch (err) {
        console.error("Fetch Applied Jobs Error:", err);
        setError("Failed to load applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [user?._id]);

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

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        {error}
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
          const job = app.job || app.jobId;
          const company = app.company || app.companyId;

          return (
            <div
              key={app._id}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:-translate-y-1 transition"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {job?.title || "Job Title"}
              </h3>

              <p className="text-gray-600 mb-3">
                <span className="font-medium">Company:</span>{" "}
                {company?.companyName || "N/A"}
              </p>

              {/* Status Badge */}
              <span
                className={`inline-block mb-3 px-3 py-1 text-sm rounded-full font-medium
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

              <div className="space-y-1 text-gray-700">
                <p>
                  <span className="font-medium">Applied On:</span>{" "}
                  {app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString()
                    : "N/A"}
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

              <button
                onClick={() =>
                  navigate(`/candidate/CompanyAboutCard/${company?._id}`)
                }
                className="mt-5 w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition font-medium"
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
