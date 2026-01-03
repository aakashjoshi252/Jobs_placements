import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi, jobsApi, applicationApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import { 
  HiChatAlt2, 
  HiBell, 
  HiDocumentText,
  HiClock,
  HiStar,
  HiCheckCircle,
  HiXCircle,
  HiSearch,
  HiClipboardList,
  HiCog,
  HiLightBulb,
  HiChevronRight,
  HiLocationMarker,
  HiCurrencyDollar,
  HiPlus
} from "react-icons/hi";

export default function CandidateHome() {
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, jobsRes, applicationsRes] = await Promise.all([
          dashboardApi.get("/candidate", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          jobsApi.get("/").catch(() => ({ data: [] })),
          applicationApi.get(`/applied/${user._id}`).catch(() => ({ data: { applications: [] } })),
        ]);

        setStats(statsRes.data.data);
        
        const jobs = jobsRes.data || [];
        const shuffled = jobs.sort(() => 0.5 - Math.random());
        setRecommendedJobs(shuffled.slice(0, 6));

        const apps = applicationsRes.data?.applications || applicationsRes.data?.data || [];
        setRecentApplications(apps.slice(0, 5));

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const totalApplications = stats?.totalApplications || 0;
  const successRate = totalApplications > 0 
    ? Math.round(((stats?.selected || 0) / totalApplications) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1A3D63] to-[#4A7FA7] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user?.username || 'Candidate'}!
              </h1>
              <p className="text-emerald-100">Your job search journey continues</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/chat")}
                className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition font-medium flex items-center gap-2"
              >
                <HiChatAlt2 className="text-xl" />
                Chats
              </button>

              <button
                onClick={() => navigate("/notification")}
                className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition font-medium flex items-center gap-2"
              >
                <HiBell className="text-xl" />
                Notifications
              </button>

              <button
                onClick={() => navigate("/candidate/resume")}
                className="px-5 py-2.5 rounded-lg bg-white text-emerald-600 hover:bg-emerald-50 transition font-semibold flex items-center gap-2 shadow-lg"
              >
                <HiDocumentText className="text-xl" />
                My Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 pb-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard title="Applied Jobs" value={totalApplications} icon={<HiClipboardList />} color="blue" />
          <StatCard title="Pending" value={stats?.pending || 0} icon={<HiClock />} color="yellow" />
          <StatCard title="Shortlisted" value={stats?.shortlisted || 0} icon={<HiStar />} color="purple" />
          <StatCard title="Selected" value={stats?.selected || 0} icon={<HiCheckCircle />} color="green" />
          <StatCard title="Rejected" value={stats?.rejected || 0} icon={<HiXCircle />} color="red" />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Applications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                  <p className="text-sm text-gray-500 mt-1">Track your latest job applications</p>
                </div>
                <button
                  onClick={() => navigate("/candidate/appliedJobs")}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
                >
                  View All
                  <HiChevronRight />
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <ApplicationRow key={app._id} application={app} navigate={navigate} />
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <HiClipboardList className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-500 mb-6">Start applying to jobs that match your skills</p>
                    <button
                      onClick={() => navigate("/candidate/jobs")}
                      className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium inline-flex items-center gap-2"
                    >
                      <HiSearch />
                      Browse Jobs
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Jobs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                <p className="text-sm text-gray-500 mt-1">Jobs matching your profile</p>
              </div>

              <div className="p-6">
                {recommendedJobs.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {recommendedJobs.map((job) => (
                      <JobCard key={job._id} job={job} navigate={navigate} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HiSearch className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No job recommendations available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Success Rate */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Success Rate</h3>
              <p className="text-emerald-100 text-sm mb-6">Your application success metrics</p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-100 text-sm">Success Rate</span>
                    <span className="font-bold text-2xl">{successRate}%</span>
                  </div>
                  <div className="w-full bg-emerald-900/50 rounded-full h-3">
                    <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${successRate}%` }} />
                  </div>
                </div>

                <div className="pt-4 border-t border-emerald-500/30 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-emerald-100 mb-1">Applied</div>
                    <div className="text-2xl font-bold">{totalApplications}</div>
                  </div>
                  <div>
                    <div className="text-sm text-emerald-100 mb-1">Selected</div>
                    <div className="text-2xl font-bold">{stats?.selected || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionButton icon={<HiSearch />} label="Browse All Jobs" onClick={() => navigate("/candidate/jobs")} />
                <QuickActionButton icon={<HiClipboardList />} label="My Applications" onClick={() => navigate("/candidate/appliedJobs")} />
                <QuickActionButton icon={<HiDocumentText />} label="Update Resume" onClick={() => navigate("/candidate/resume")} />
                <QuickActionButton icon={<HiCog />} label="Profile Settings" onClick={() => navigate("/settings")} />
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <HiLightBulb className="text-2xl text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-600">
                    Complete your profile and upload an updated resume to increase your chances by 60%.
                  </p>
                </div>
              </div>
            </div>

            {/* Application Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Application Breakdown</h3>
              <div className="space-y-3">
                <ProgressBar label="Pending" value={stats?.pending || 0} total={totalApplications} color="yellow" />
                <ProgressBar label="Shortlisted" value={stats?.shortlisted || 0} total={totalApplications} color="purple" />
                <ProgressBar label="Selected" value={stats?.selected || 0} total={totalApplications} color="green" />
                <ProgressBar label="Rejected" value={stats?.rejected || 0} total={totalApplications} color="red" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl text-white mb-3 shadow-lg`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 font-medium mt-1">{title}</div>
    </div>
  );
}

function ApplicationRow({ application, navigate }) {
  const job = application.job || application.jobId;
  const company = application.company || application.companyId;
  const daysAgo = Math.floor((Date.now() - new Date(application.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-700",
    SHORTLISTED: "bg-purple-100 text-purple-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-4 hover:bg-gray-50 transition">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{job?.title || "Job Title"}</h3>
            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColors[application.status] || "bg-gray-100 text-gray-700"}`}>
              {application.status}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span>{company?.companyName || "Company"}</span>
            <span className="text-gray-400">{daysAgo === 0 ? "Today" : `${daysAgo}d ago`}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/candidate/CompanyAboutCard/${job?._id}`)}
          className="ml-4 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
        >
          View
        </button>
      </div>
    </div>
  );
}

function JobCard({ job, navigate }) {
  return (
    <div
      onClick={() => navigate(`/candidate/CompanyAboutCard/${job._id}`)}
      className="border border-gray-200 rounded-lg p-4 hover:border-emerald-500 hover:shadow-md transition cursor-pointer"
    >
      <h3 className="font-semibold text-gray-900 mb-1 truncate">{job.title}</h3>
      <p className="text-sm text-gray-600 mb-3">{job.companyName}</p>
      
      <div className="space-y-1 text-xs text-gray-500">
        <p className="flex items-center gap-1">
          <HiLocationMarker />
          {job.jobLocation}
        </p>
        <p className="flex items-center gap-1">
          <HiCurrencyDollar />
          {job.salary}
        </p>
      </div>

      <button className="mt-3 w-full py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition text-sm font-medium">
        View Details
      </button>
    </div>
  );
}

function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left group"
    >
      <span className="text-2xl text-gray-600 group-hover:text-gray-900">{icon}</span>
      <span className="font-medium text-gray-700 group-hover:text-gray-900">{label}</span>
      <HiChevronRight className="ml-auto text-gray-400 group-hover:text-gray-600" />
    </button>
  );
}

function ProgressBar({ label, value, total, color }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  const colorClasses = {
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    green: "bg-green-500",
    red: "bg-red-500",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${colorClasses[color]} h-2 rounded-full transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}