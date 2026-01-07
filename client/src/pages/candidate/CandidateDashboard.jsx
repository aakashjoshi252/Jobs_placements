import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Bookmark,
  Bell,
  UserCircle,
} from 'lucide-react';

const CandidateDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/candidate/dashboard`,
        { withCredentials: true }
      );
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const applicationStats = stats?.stats || {};
  const profileCompletion = stats?.profileCompletion || {};

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your applications and discover new opportunities</p>
      </div>

      {/* Profile Completion */}
      {profileCompletion.percentage < 100 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <UserCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
                <p className="text-sm text-gray-600">Get more visibility to recruiters</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-blue-600">{profileCompletion.percentage}%</p>
              <p className="text-xs text-gray-600">Complete</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion.percentage}%` }}
            ></div>
          </div>
          {profileCompletion.missing && profileCompletion.missing.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-700">Missing:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {profileCompletion.missing.map((item, index) => (
                  <li key={index}>• {item}</li>
                ))}
              </ul>
            </div>
          )}
          <Link
            to="/profile"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Applications */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900">{applicationStats.totalApplications || 0}</p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-500 opacity-80" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-gray-900">{applicationStats.pending || 0}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500 opacity-80" />
          </div>
        </div>

        {/* Accepted */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Accepted</p>
              <p className="text-3xl font-bold text-gray-900">{applicationStats.accepted || 0}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500 opacity-80" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Rejected</p>
              <p className="text-3xl font-bold text-gray-900">{applicationStats.rejected || 0}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-500 opacity-80" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/candidate/recommendations"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <TrendingUp className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Job Recommendations</h3>
          <p className="text-purple-100 text-sm mb-3">
            {stats?.recommendedJobsCount || 0} jobs matching your skills
          </p>
          <span className="text-sm font-medium">Explore →</span>
        </Link>

        <Link
          to="/candidate/saved-jobs"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Bookmark className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Saved Jobs</h3>
          <p className="text-blue-100 text-sm mb-3">
            {stats?.savedJobsCount || 0} jobs saved for later
          </p>
          <span className="text-sm font-medium">View All →</span>
        </Link>

        <Link
          to="/candidate/job-alerts"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Bell className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Job Alerts</h3>
          <p className="text-green-100 text-sm mb-3">
            {stats?.activeAlerts || 0} active alerts
          </p>
          <span className="text-sm font-medium">Manage →</span>
        </Link>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
          <Link to="/applications" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All →
          </Link>
        </div>

        {stats?.recentApplications && stats.recentApplications.length > 0 ? (
          <div className="space-y-4">
            {stats.recentApplications.map((application) => (
              <div
                key={application._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {application.company?.logo && (
                    <img
                      src={application.company.logo}
                      alt={application.company.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{application.job?.title}</h3>
                    <p className="text-sm text-gray-600">{application.company?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Applied {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : application.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : application.status === 'shortlisted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {application.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No applications yet</p>
            <Link
              to="/jobs"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Jobs →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
