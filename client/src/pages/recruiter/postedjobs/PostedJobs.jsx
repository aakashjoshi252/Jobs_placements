import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { jobsApi } from "../../../../api/api";

export default function PostedJobs() {
    const [postedJobs,setPostedJobs] =useState([]);
    const loggedUser = useSelector((state) => state.auth.user)
    console.log(postedJobs)
    const fetchJobsByRecruiter = async () => {
        try {
            const res = await jobsApi.get(`/recruiter/${loggedUser._id}`)
            setPostedJobs(res.data.data)
        } catch (error) {
            console.log("data not found")
        }
    }
    useEffect(() => {
        fetchJobsByRecruiter();
    }, []);

  return (
  <div className="px-6 py-4">
    <h1 className="text-3xl font-bold text-gray-800 mb-6">
      Your Posted Jobs
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postedJobs.length > 0 ? (
        postedJobs.map((job) => (
          <div
            key={job._id}
            className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-800">
                {job.title}
              </h2>
              <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {job.jobType}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {job.description}
            </p>

            {/* Job Details */}
            <ul className="space-y-1 text-gray-700 text-sm mb-4">
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
  </div>
);

}