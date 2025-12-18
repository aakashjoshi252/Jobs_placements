import { useEffect, useState } from "react";
import { companyApi, jobsApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function CompanyAboutPage() {
  const navigate = useNavigate();
  const jobId = sessionStorage.getItem("selectedJobId");

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  console.log(company)

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
  <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12">

    {!company ? (
      <p className="text-center text-lg font-medium text-gray-500 mt-12">
        Loading company details...
      </p>
    ) : (
      <>
        {/* Back Button */}
        <button
          onClick={() => navigate("/candidate/home")}
          className="
            mb-6
            inline-flex items-center justify-center
            px-6 py-2.5
            bg-gray-700 text-white
            rounded-lg font-medium
            hover:bg-gray-900
            transition-all duration-200
            shadow-sm
          "
        >
          ← Back to Home
        </button>

        {/* Company Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            About the Company
          </h1>

          {/* Company Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-xl font-semibold text-gray-800">
              {company?.companyName}
            </p>

            <img
              src={company.uploadLogo}
              alt="Company logo"
              className="w-20 h-20 object-contain rounded-md border"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 font-medium">Description</p>
            <p className="mt-1 text-gray-800 leading-relaxed">
              {company.description}
            </p>
          </div>

          {/* Company Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Info label="Established" value={company.establishedYear} />
            <Info label="Location" value={company.location} />
            <Info
              label="Website"
              value={
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-words"
                >
                  {company.website}
                </a>
              }
            />
            <Info label="Email" value={company.contactEmail} />
            <Info label="Phone" value={company.contactNumber} />
          </div>
        </div>

        {/* Job Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {job?.title}
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            {job?.description}
          </p>

          {/* Job Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <Info label="Location" value={job?.jobLocation} />
            <Info label="Job Type" value={job?.jobType} />
            <Info label="Experience" value={job?.experience} />
            <Info label="Salary" value={job?.salary} />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/candidate/applications/list")}
              className="
                w-full
                bg-gray-700 text-white
                py-3 rounded-xl
                font-semibold
                hover:bg-gray-900
                transition-all duration-200
              "
            >
              Back to Applied
            </button>

            <button
              onClick={() => handleApplyClick(job)}
              className="
                w-full
                bg-blue-600 text-white
                py-3 rounded-xl
                font-semibold
                hover:bg-blue-700
                transition-all duration-200
              "
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
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500 font-medium">{label}</p>
    <p className="mt-1 text-gray-800 font-semibold">
      {value}
    </p>
  </div>
);
