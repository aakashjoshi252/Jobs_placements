import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi, jobsApi, applicationApi } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function RecruiterHome() {
  const { token } = useSelector((state) => state.auth);
  const loggedUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [statsRes, jobsRes] = await Promise.all([
          dashboardApi.get("/recruiter", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          jobsApi.get(`/recruiter/${loggedUser._id}`),
        ]);

        setStats(statsRes.data.data);
        
        // Get 5 most recent jobs
        const jobs = jobsRes.data.data || [];
        setRecentJobs(jobs.slice(0, 5));

      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, loggedUser._id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {loggedUser?.username || 'Recruiter'}!
              </h1>
              <p className="text-blue-100">
                Here's what's happening with your jobs today
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/chat")}
                className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition font-medium flex items-center gap-2"
              >
                <span>💬</span>
                Chats
              </button>

              <button
                onClick={() => navigate("/notification")}
                className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition font-medium flex items-center gap-2"
              >
                <span>🔔</span>
                Notifications
              </button>

              <button
                onClick={() => navigate("/recruiter/company/jobpost")}
                className="px-5 py-2.5 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition font-semibold flex items-center gap-2 shadow-lg"
              >
                <span>➕</span>
                Post New Job
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Jobs Posted"
            value={stats?.totalJobs || 0}
            icon="💼"
            color="blue"
            trend="+12% from last month"
          />
          <StatCard
            title="Total Applications"
            value={stats?.totalApplications || 0}
            icon="📝"
            color="green"
            trend={`${stats?.pending || 0} pending`}
          />
          <StatCard
            title="Approved"
            value={stats?.approved || 0}
            icon="✅"
            color="emerald"
            percentage={(stats?.approved / stats?.totalApplications * 100) || 0}
          />
          <StatCard
            title="Rejected"
            value={stats?.rejected || 0}
            icon="❌"
            color="red"
            percentage={(stats?.rejected / stats?.totalApplications * 100) || 0}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Jobs - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Job Posts</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Your latest job postings
                  </p>
                </div>
                <button
                  onClick={() => navigate("/recruiter/company/postedjobs")}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View All →
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <JobRow key={job._id} job={job} navigate={navigate} />
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No jobs posted yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by posting your first job
                    </p>
                    <button
                      onClick={() => navigate("/recruiter/company/jobpost")}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                    >
                      Post a Job
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <QuickActionButton
                  icon="📊"
                  label="View All Jobs"
                  onClick={() => navigate("/recruiter/company/postedjobs")}
                />
                <QuickActionButton
                  icon="👥"
                  label="Browse Candidates"
                  onClick={() => navigate("/recruiter/candidates-list")}
                />
                <QuickActionButton
                  icon="🏢"
                  label="Company Profile"
                  onClick={() => navigate("/recruiter/company")}
                />
                <QuickActionButton
                  icon="⚙️"
                  label="Settings"
                  onClick={() => navigate("/settings")}
                />
              </div>
            </div>

            {/* Performance Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Performance Overview</h3>
              <p className="text-blue-100 text-sm mb-6">
                Your hiring stats this month
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Response Rate</span>
                  <span className="font-bold">
                    {stats?.totalApplications > 0
                      ? Math.round(
                          ((stats?.approved + stats?.rejected) /
                            stats?.totalApplications) *
                            100
                        )
                      : 0}%
                  </span>
                </div>

                <div className="w-full bg-blue-900/50 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        stats?.totalApplications > 0
                          ? Math.round(
                              ((stats?.approved + stats?.rejected) /
                                stats?.totalApplications) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>

                <div className="pt-4 border-t border-blue-500/30">
                  <div className="text-sm text-blue-100 mb-1">Active Jobs</div>
                  <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-600">
                    Jobs with detailed descriptions and clear requirements get 40%
                    more quality applications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================= STAT CARD COMPONENT =================
function StatCard({ title, value, icon, color, trend, percentage }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    emerald: "from-emerald-500 to-emerald-600",
    red: "from-red-500 to-red-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl shadow-lg`}
        >
          {icon}
        </div>
        {percentage !== undefined && (
          <span className="text-xs font-medium text-gray-500">
            {percentage.toFixed(1)}%
          </span>
        )}
      </div>

      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{title}</div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">{trend}</span>
        </div>
      )}
    </div>
  );
}

// ================= JOB ROW COMPONENT =================
function JobRow({ job, navigate }) {
  const daysAgo = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-4 hover:bg-gray-50 transition cursor-pointer" onClick={() => navigate(`/recruiter/company/postedjobs/edit/${job._id}`)}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              {job.jobType}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span>📍</span>
              {job.jobLocation}
            </span>
            <span className="flex items-center gap-1">
              <span>💰</span>
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <span>👥</span>
              {job.openings} openings
            </span>
            <span className="text-gray-400">
              {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/recruiter/company/postedjobs/edit/${job._id}`);
          }}
          className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

// ================= QUICK ACTION BUTTON =================
function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left group"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-700 group-hover:text-gray-900">
        {label}
      </span>
      <span className="ml-auto text-gray-400 group-hover:text-gray-600">→</span>
    </button>
  );
}