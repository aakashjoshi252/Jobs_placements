import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { jobsApi } from "../../../../api/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await jobsApi.get(`/`);
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSelectJob = (jobId) => {
    sessionStorage.setItem("selectedJobId", jobId);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
      {jobs.map((job) => (
        <div
          key={job._id}
          className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {job.title}
          </h3>

          <p className="text-gray-700">
            <span className="font-semibold">Company:</span> {job.companyName}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">Recruiter:</span>{" "}
            {job.recruiterId?.username}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">Location:</span> {job?.jobLocation}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">Type:</span> {job.empType}
          </p>

          <NavLink to={`/candidate/CompanyAboutCard/${job._id}`}>
            <button
              type="button"
              className="
                w-full 
                mt-4 
                py-2.5 
                bg-blue-600 
                text-white 
                rounded-lg 
                font-semibold 
                hover:bg-blue-700 
                transition
              "
              onClick={() => handleSelectJob(job._id)}
            >
              Apply
            </button>
          </NavLink>
        </div>
      ))}
    </div>
  );
}
