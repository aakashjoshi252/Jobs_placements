import { useEffect, useState, useMemo } from "react";
import { useNavigate} from "react-router-dom";
import { jobsApi } from "../../../api/api";
import Pagination from "../../../components/pagination/Pagination";

const ITEMS_PER_PAGE = 6;

export default function Jobs({
  filters = { title: "", company: "", location: "" },
}) {
  const navigate= useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      const response = await jobsApi.get(`/`);
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= FILTER LOGIC =================
  const filteredJobs = useMemo(() => {
    const title = filters?.title?.toLowerCase() || "";
    const company = filters?.company?.toLowerCase() || "";
    const location = filters?.location?.toLowerCase() || "";

    return jobs.filter((job) => (
      job.title?.toLowerCase().includes(title) &&
      job.companyName?.toLowerCase().includes(company) &&
      job.jobLocation?.toLowerCase().includes(location)
    ));
  }, [jobs, filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
        {paginatedJobs.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No jobs found
          </p>
        ) : (
          paginatedJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {job.title}
              </h3>

              <p className="text-gray-700">
                <span className="font-semibold">Company:</span>{" "}
                {job.companyName}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Recruiter:</span>{" "}
                {job.recruiterId?.username || "N/A"}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Location:</span>{" "}
                {job.jobLocation}
              </p>

              <p className="text-gray-700">
                <span className="font-semibold">Type:</span>{" "}
                {job.empType}
              </p>
                <button
                  onClick={() => navigate(`/candidate/CompanyAboutCard/${job._id}`)}
                  className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Apply
                </button>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
