import { useEffect, useState } from "react";
import { companyApi, jobsApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyAboutPage() {
  const navigate = useNavigate();
  const jobId = sessionStorage.getItem("selectedJobId");

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);

  const fetchJob = async () => {
    try {
      const res = await jobsApi.get(`/${jobId}`);
      const jobData = res.data;
      setJob(jobData);

      const companyId = jobData.companyId?._id;
      if (companyId) {
        const compRes = await companyApi.get(`/${companyId}`);
        setCompany(compRes.data);
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    fetchJob();
  }, []);

  const handleApplyClick = (job) => {
    sessionStorage.setItem("selectedJob", JSON.stringify(job));
    navigate("/candidate/CompanyAboutCard/jobs/apply");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-10">

      {!company ? (
        <p className="text-center text-lg font-medium text-gray-600 mt-10">
          Loading company details...
        </p>
      ) : (
        <>
          {/* Company Section */}
          <button className="
              w-1/5
              bg-gray-600 
              text-white 
              py-3 
              rounded-xl 
              font-semibold 
              hover:bg-yellow-700 
              transition-all
              shadow-md"
            onClick={() => navigate("/candidate/home")}>Back to Home</button>
          <div className="mt-2 bg-white shadow-lg rounded-2xl p-8 mb-8 border border-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              About The Company
            </h1>

            {/* Description */}
            <div>
              <p className="text-gray-500 text-sm font-medium">Description</p>
              <p className="mt-1 text-gray-900 font-semibold text-lg">
                {company.description}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Established Year */}
              <div>
                <p className="text-gray-500 text-sm font-medium">Established</p>
                <p className="mt-1 text-gray-900 font-semibold text-lg">
                  {company.establishedYear}
                </p>
              </div>

              {/* Location */}
              <div>
                <p className="text-gray-500 text-sm font-medium">Location</p>
                <p className="mt-1 text-gray-900 font-semibold text-lg">
                  {company.location}
                </p>
              </div>

              {/* Website */}
              <div>
                <p className="text-gray-500 text-sm font-medium">Website</p>
                <a
                  href={company.website}
                  className="mt-1 text-blue-600 underline break-words font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              </div>

              {/* Email */}
              <div>
                <p className="text-gray-500 text-sm font-medium">Email</p>
                <p className="mt-1 text-gray-900 font-semibold text-lg">
                  {company.contactEmail}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-gray-500 text-sm font-medium">Phone</p>
                <p className="mt-1 text-gray-900 font-semibold text-lg">
                  {company.contactNumber}
                </p>
              </div>
            </div>
          </div>

          {/* Job Section */}
          <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {job?.title}
            </h2>

            <p className="text-gray-700 leading-relaxed mb-6">
              {job?.description}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-500 text-sm font-medium">Location</p>
                <p className="mt-1 text-gray-900 font-semibold">
                  {job?.jobLocation}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-medium">Job Type</p>
                <p className="mt-1 text-gray-900 font-semibold">
                  {job?.jobType}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-medium">Experience</p>
                <p className="mt-1 text-gray-900 font-semibold">
                  {job?.experience}
                </p>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-medium">Salary</p>
                <p className="mt-1 text-gray-900 font-semibold">
                  {job?.salary}
                </p>
              </div>
            </div>

            <div className="flex gap-30">
              <button
                className="
              w-full
              bg-gray-600 
              text-white 
              py-3 
              rounded-xl 
              font-semibold 
              hover:bg-yellow-700 
              transition-all
              shadow-md"
                onClick={() => navigate("/candidate/applications/list")}>
                Back to Applied</button>
              <button
                className="
              w-full
              bg-blue-600 
              text-white 
              py-3 
              rounded-xl 
              font-semibold 
              hover:bg-blue-700 
              transition-all
              shadow-md
            "
                onClick={() => handleApplyClick(job)}
              >
                Apply Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

}
