import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { jobsApi } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import { 
  HiPlus, 
  HiBriefcase, 
  HiCheckCircle, 
  HiClock, 
  HiUsers,
  HiSearch,
  HiX,
  HiLocationMarker,
  HiCurrencyDollar,
  HiUserGroup,
  HiAcademicCap
} from "react-icons/hi";

export default function PostedJobs() {
  const navigate = useNavigate();
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const loggedUser = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchJobsByRecruiter = async () => {
    try {
      setLoading(true);
      const res = await jobsApi.get(`/recruiter/${loggedUser._id}`);
      setPostedJobs(res.data.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) return;

    try {
      await jobsApi.delete(`/${jobId}`);
      setPostedJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete job");
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...postedJobs];

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.jobLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((job) => job.jobType === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((job) => {
        if (!job.deadline) return filterStatus === "active";
        const isExpired = new Date(job.deadline) < new Date();
        return filterStatus === "expired" ? isExpired : !isExpired;
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "openings":
          return b.openings - a.openings;
        default:
          return 0;
      }
    });

    return filtered;
  }, [postedJobs, searchTerm, filterType, filterStatus, sortBy]);

  useEffect(() => {
    fetchJobsByRecruiter();
  }, []);

  const stats = useMemo(() => {
    const total = postedJobs.length;
    const active = postedJobs.filter(
      (job) => !job.deadline || new Date(job.deadline) >= new Date()
    ).length;
    const totalOpenings = postedJobs.reduce((sum, job) => sum + (job.openings || 0), 0);

    return { total, active, expired: total - active, totalOpenings };
  }, [postedJobs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Posted Jobs</h1>
              <p className="text-gray-600">Manage and track all your job postings</p>
            </div>

            <button
              onClick={() => navigate("/recruiter/company/jobpost")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg flex items-center gap-2"
            >
              <HiPlus className="text-xl" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-12">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Jobs" value={stats.total} icon={<HiBriefcase />} color="blue" />
          <StatsCard label="Active Jobs" value={stats.active} icon={<HiCheckCircle />} color="green" />
          <StatsCard label="Expired Jobs" value={stats.expired} icon={<HiClock />} color="red" />
          <StatsCard label="Total Openings" value={stats.totalOpenings} icon={<HiUsers />} color="purple" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Jobs</label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by title, company, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="openings">Most Openings</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterType !== "all" || filterStatus !== "all") && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && <FilterBadge label={`Search: "${searchTerm}"`} onRemove={() => setSearchTerm("")} />}
              {filterType !== "all" && <FilterBadge label={`Type: ${filterType}`} onRemove={() => setFilterType("all")} />}
              {filterStatus !== "all" && <FilterBadge label={`Status: ${filterStatus}`} onRemove={() => setFilterStatus("all")} />}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredAndSortedJobs.length}</span> of{" "}
            <span className="font-semibold">{postedJobs.length}</span> jobs
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill().map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 animate-pulse">
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

        {/* Jobs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job) => (
                <JobCard key={job._id} job={job} onDelete={handleDelete} onEdit={() => navigate(`/recruiter/company/postedjobs/edit/${job._id}`)} />
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <HiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm || filterType !== "all" || filterStatus !== "all" ? "No jobs match your filters" : "No jobs posted yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filterType !== "all" || filterStatus !== "all" ? "Try adjusting your search or filters" : "Start by posting your first job"}
                </p>
                {(!searchTerm && filterType === "all" && filterStatus === "all") && (
                  <button
                    onClick={() => navigate("/recruiter/company/jobpost")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold inline-flex items-center gap-2"
                  >
                    <HiPlus />
                    Post a Job
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl text-white mb-3 shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 font-medium mt-1">{label}</div>
    </div>
  );
}

function FilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:bg-blue-100 rounded-full p-0.5 transition">
        <HiX className="text-sm" />
      </button>
    </span>
  );
}

function JobCard({ job, onDelete, onEdit }) {
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const daysAgo = Math.floor((Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white shadow-sm rounded-xl p-6 border border-gray-200 hover:shadow-lg transition group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition truncate">{job.title}</h2>
          <p className="text-sm text-gray-500">{job.companyName}</p>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            job.jobType === "Remote" ? "bg-green-100 text-green-700" :
            job.jobType === "Hybrid" ? "bg-purple-100 text-purple-700" :
            "bg-blue-100 text-blue-700"
          }`}>{job.jobType}</span>
          {isExpired && <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">Expired</span>}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <InfoRow icon={<HiLocationMarker />} text={job.jobLocation} />
        <InfoRow icon={<HiUserGroup />} text={`${job.openings} openings`} />
        <InfoRow icon={<HiBriefcase />} text={job.empType} />
        <InfoRow icon={<HiAcademicCap />} text={job.experience} />
        <InfoRow icon={<HiCurrencyDollar />} text={job.salary} />
      </div>

      {job.deadline && (
        <div className={`text-sm mb-4 pb-4 border-b border-gray-100 ${isExpired ? "text-red-600" : "text-gray-600"}`}>
          <span className="font-medium">{isExpired ? "Expired" : "Deadline"}:</span> {new Date(job.deadline).toLocaleDateString()}
        </div>
      )}

      <div className="text-xs text-gray-500 mb-4">
        Posted {daysAgo === 0 ? "today" : `${daysAgo} days ago`}
      </div>

      <div className="flex gap-3">
        <button onClick={onEdit} className="flex-1 bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition">Edit Job</button>
        <button onClick={() => onDelete(job._id)} className="flex-1 bg-red-50 text-red-600 font-medium py-2.5 rounded-lg hover:bg-red-100 transition border border-red-200">Delete</button>
      </div>
    </div>
  );
}

function InfoRow({ icon, text }) {
  return (
    <p className="text-sm text-gray-700 flex items-center gap-2">
      <span className="text-gray-500">{icon}</span>
      <span>{text}</span>
    </p>
  );
}