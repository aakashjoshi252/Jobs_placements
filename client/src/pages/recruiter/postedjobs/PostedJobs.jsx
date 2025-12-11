import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { jobsApi } from "../../../../api/api";

export default function PostedJobs() {
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedUser = useSelector((state) => state.auth.user);

  const fetchJobsByRecruiter = async () => {
    try {
      const res = await jobsApi.get(`/recruiter/${loggedUser._id}`);
      setPostedJobs(res.data.data || []);
    } catch (error) {
      console.error("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsByRecruiter();
  }, []);

  return (
    <div className="px-6 py-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Your Posted Jobs
      </h1>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>

                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Jobs */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postedJobs.length > 0 ? (
            postedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                {/* Job Header */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {job.title}
                  </h2>
                  <span className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {job.jobType}
                  </span>
                </div>

                {/* Company Name + Deadline */}
                <p className="text-sm text-gray-500 mb-1">
                  <strong>Company:</strong> {job.companyName}
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Deadline:{" "}
                  {job.deadline
                    ? new Date(job.deadline).toLocaleDateString()
                    : "No Deadline"}
                </p>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Job Info */}
                <ul className="space-y-1 text-gray-700 text-sm mb-5">
                  <li>
                    <strong>Location:</strong> {job.jobLocation}
                  </li>
                  <li>
                    <strong>Experience:</strong> {job.experience}
                  </li>
                  <li>
                    <strong>Salary:</strong> {job.salary}
                  </li>
                  <li>
                    <strong>Openings:</strong> {job.openings}
                  </li>
                </ul>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-yellow-400 text-gray-900 font-medium py-2 rounded-md hover:bg-yellow-500 transition">
                    Edit
                  </button>

                  <button className="flex-1 bg-red-500 text-white font-medium py-2 rounded-md hover:bg-red-600 transition">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-lg col-span-full text-center">
              No posted jobs found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
