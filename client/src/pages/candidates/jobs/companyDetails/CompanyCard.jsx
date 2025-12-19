import { useEffect, useState } from "react";
import { companyApi, jobsApi } from "../../../../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setJobLoading,
  setJob,
  setJobError,
} from "../../../../redux/slices/job";

export default function CompanyAboutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { jobId } = useParams();

  //  Redux selector (job data from store)
  const { data: job, loading, error } = useSelector(
    (state) => state.job
  );

  const isLoggedIn = useSelector((state) => state.auth.user);

  // Local state ONLY for company
  const [company, setCompany] = useState(null);

  // ================= FETCH JOB & COMPANY =================
  useEffect(() => {
    const fetchJobAndCompany = async () => {
      try {
        dispatch(setJobLoading());

        // Fetch job
        const res = await jobsApi.get(`/${jobId}`);
        const jobData = res.data;
        console.log(jobData)
        dispatch(setJob(jobData));

        // Fetch company
        const companyId = jobData?.companyId?._id;
        if (companyId) {
          const compRes = await companyApi.get(`/${companyId}`);
          setCompany(compRes.data);
        }
      } catch (err) {
        dispatch(
          setJobError(
            err.response?.data?.message || "Failed to load job"
          )
        );
      }
    };

    if (jobId) fetchJobAndCompany();
  }, [jobId, dispatch]);

  // ================= CONDITIONAL BACK =================
  const handleBack = () => {
    if (isLoggedIn && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isLoggedIn ? "/candidate/home" : "/");
    }
  };

  // ================= APPLY =================
  const handleApplyClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Store selected job (from Redux)
    navigate("/candidate/CompanyAboutCard/jobs/apply");
  };

  // ================= UI STATES =================
  if (loading)
    return (
      <p className="text-center text-lg mt-12">Loading...</p>
    );

  if (error)
    return (
      <p className="text-center text-red-600 mt-12">
        {error}
      </p>
    );

  if (!company || !job)
    return (
      <p className="text-center text-lg mt-12">
        Loading company details...
      </p>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12">
      {/* ================= COMPANY INFO ================= */}
      <div className="bg-white rounded-2xl border p-6 mb-10">
        <h1 className="text-3xl font-bold mb-6">
          About the Company
        </h1>

        <div className="flex justify-between mb-6">
          <p className="text-xl font-semibold">
            {company.companyName}
          </p>

          {company.uploadLogo && (
            <img
              src={company.uploadLogo}
              alt="Company logo"
              className="w-20 h-20 object-contain"
            />
          )}
        </div>

        <p className="mb-6">{company.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Info label="Established" value={company.establishedYear} />
          <Info label="Location" value={company.location} />
          <Info label="Website" value={company.website} />
          <Info label="Email" value={company.contactEmail} />
        </div>
      </div>

      {/* ================= JOB INFO ================= */}
      <div className="bg-white rounded-2xl border p-6">
        <h2 className="text-2xl font-bold mb-4">
          {job.title}
        </h2>

        <p className="mb-6">{job.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Info label="Location" value={job.jobLocation} />
          <Info label="Job Type" value={job.jobType} />
          <Info label="Experience" value={job.experience} />
          <Info label="Salary" value={job.salary} />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-gray-700 text-white py-3 rounded-xl"
          >
            Back
          </button>

          <button
            onClick={handleApplyClick}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ================= INFO COMPONENT =================
const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value || "N/A"}</p>
  </div>
);
