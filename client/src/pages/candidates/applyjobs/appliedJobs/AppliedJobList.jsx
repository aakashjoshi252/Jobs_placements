import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function AppliedJobs() {
  const navigate = useNavigate();
  const LoggedUser = useSelector((state) => state.auth.user);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        if (!LoggedUser?._id) return;

        const res = await applicationApi.get(`/applied/${LoggedUser._id}`);
        const applications = res.data.applications || [];
        console.log("Applications:", applications);
        setApplications(applications);
      } catch (err) {
        console.error("Fetch Applied Jobs Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [LoggedUser?._id]);

  if (!LoggedUser?._id) {
    return <p className="text-center mt-8 text-gray-500">Please login to view applied jobs.</p>;
  }

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading applied jobs...</p>;
  }

  if (applications.length === 0) {
    return <p className="text-center mt-8 text-gray-500">You have not applied to any jobs yet.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">My Applied Jobs</h2>

      <div className="grid gap-6">
        {applications.map((app) => {
          const job = app.jobId;
          const company = job?.companyId;
          return (
            <div
              key={app._id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <h3 className="text-xl font-semibold mb-2">{job?.title}</h3>

              <p className="mb-1">
                <span className="font-medium">Company:</span>{" "}
                {company?.companyName || "N/A"}
              </p>

              <p className="mb-1">
                <span className="font-medium">Status:</span> {app.status}
              </p>

              <p className="mb-1">
                <span className="font-medium">Applied On:</span>{" "}
                {new Date(app.createdAt).toLocaleDateString()}
              </p>

              {job?.location && (
                <p className="mb-1">
                  <span className="font-medium">Location:</span> {job.location}
                </p>
              )}

              {job?.salary && (
                <p className="mb-1">
                  <span className="font-medium">Salary:</span> {job.salary}
                </p>
              )}

              <button
                onClick={() =>
                  navigate(`/candidate/CompanyAboutCard/${company?._id}`)
                }
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
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
