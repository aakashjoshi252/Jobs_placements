import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";
import { 
  HiSearch, 
  HiPlus, 
  HiClipboardList, 
  HiClock, 
  HiStar, 
  HiCheckCircle, 
  HiXCircle,
  HiX,
  HiLocationMarker,
  HiCurrencyDollar,
  HiLockClosed
} from "react-icons/hi";

export default function AppliedJobs() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (!user?._id) return;

    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const res = await applicationApi.get(`/applied/${user._id}`);
        const apps = res?.data?.applications || res?.data?.data || [];
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

  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    if (searchTerm) {
      filtered = filtered.filter((app) => {
        const job = app.job || app.jobId;
        const company = app.company || app.companyId;
        return (
          job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    filtered.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

    return filtered;
  }, [applications, searchTerm, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter((a) => a.status === "PENDING").length;
    const shortlisted = applications.filter((a) => a.status === "SHORTLISTED").length;
    const approved = applications.filter((a) => a.status === "APPROVED").length;
    const rejected = applications.filter((a) => a.status === "REJECTED").length;

    return { total, pending, shortlisted, approved, rejected };
  }, [applications]);

  if (!user?._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HiLockClosed className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your applied jobs</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
              <p className="text-gray-600">Track and manage all your job applications</p>
            </div>

            <button
              onClick={() => navigate("/candidate/jobs")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold shadow-lg flex items-center gap-2"
            >
              <HiSearch className="text-xl" />
              Browse Jobs
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <StatsCard label="Total" value={stats.total} icon={<HiClipboardList />} color="blue" />
          <StatsCard label="Pending" value={stats.pending} icon={<HiClock />} color="yellow" />
          <StatsCard label="Shortlisted" value={stats.shortlisted} icon={<HiStar />} color="purple" />
          <StatsCard label="Approved" value={stats.approved} icon={<HiCheckCircle />} color="green" />
          <StatsCard label="Rejected" value={stats.rejected} icon={<HiXCircle />} color="red" />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Applications</label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {(searchTerm || statusFilter !== "all") && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && <FilterBadge label={`Search: "${searchTerm}"`} onRemove={() => setSearchTerm("")} />}
              {statusFilter !== "all" && <FilterBadge label={`Status: ${statusFilter}`} onRemove={() => setStatusFilter("all")} />}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredApplications.length}</span> of{" "}
            <span className="font-semibold">{applications.length}</span> applications
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <HiXCircle className="text-4xl text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Applications Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => <ApplicationCard key={app._id} application={app} navigate={navigate} />)
            ) : (
              <div className="col-span-full text-center py-16">
                <HiClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {applications.length === 0 ? "No applications yet" : "No applications match your filters"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {applications.length === 0 ? "Start applying to jobs that match your skills" : "Try adjusting your search or filters"}
                </p>
                {applications.length === 0 && (
                  <button
                    onClick={() => navigate("/candidate/jobs")}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold inline-flex items-center gap-2"
                  >
                    <HiSearch />
                    Browse Jobs
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
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-xl text-white mb-2 shadow-lg`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 font-medium mt-1">{label}</div>
    </div>
  );
}

function FilterBadge({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full font-medium">
      {label}
      <button onClick={onRemove} className="hover:bg-emerald-100 rounded-full p-0.5 transition">
        <HiX className="text-sm" />
      </button>
    </span>
  );
}

function ApplicationCard({ application, navigate }) {
  const job = application.job || application.jobId;
  const company = application.company || application.companyId;
  const daysAgo = Math.floor((Date.now() - new Date(application.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const statusConfig = {
    PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
    SHORTLISTED: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
    APPROVED: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    REJECTED: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  };

  const config = statusConfig[application.status] || { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-300" };

  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-2 ${config.border} hover:shadow-lg transition group`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition truncate">
            {job?.title || "Job Title"}
          </h3>
          <p className="text-sm text-gray-600">{company?.companyName || "Company Name"}</p>
        </div>
        <span className={`px-3 py-1 ${config.bg} ${config.text} text-xs rounded-full font-medium`}>
          {application.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {job?.location && (
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <HiLocationMarker className="text-gray-500" />
            {job.location}
          </p>
        )}
        {job?.salary && (
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <HiCurrencyDollar className="text-gray-500" />
            {job.salary}
          </p>
        )}
      </div>

      <div className="text-xs text-gray-500 mb-4 pb-4 border-b border-gray-100">
        Applied {daysAgo === 0 ? "today" : `${daysAgo} days ago`} • {new Date(application.createdAt).toLocaleDateString()}
      </div>

      <button
        onClick={() => navigate(`/candidate/CompanyAboutCard/${job?._id}`)}
        className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
      >
        View Job Details
      </button>
    </div>
  );
}