import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Briefcase,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Calendar,
  Building2,
  FileText,
} from 'lucide-react';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/recruiter/dashboard`,
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Recruiter Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your jobs, applications, and interviews</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Jobs */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Jobs</p>
              <p className="text-3xl font-bold">{applicationStats.totalJobs || 0}</p>
              <p className="text-blue-100 text-xs mt-2">
                {applicationStats.activeJobs || 0} active
              </p>
            </div>
            <Briefcase className="w-12 h-12 text-blue-200 opacity-80" />
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Total Applications</p>
              <p className="text-3xl font-bold">{applicationStats.totalApplications || 0}</p>
              <p className="text-purple-100 text-xs mt-2">
                {applicationStats.newApplications || 0} new
              </p>
            </div>
            <FileText className="w-12 h-12 text-purple-200 opacity-80" />
          </div>
        </div>

        {/* Shortlisted */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Shortlisted</p>
              <p className="text-3xl font-bold">{applicationStats.shortlisted || 0}</p>
              <p className="text-green-100 text-xs mt-2">
                {applicationStats.interviewed || 0} interviewed
              </p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-200 opacity-80" />
          </div>
        </div>

        {/* Companies */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Companies</p>
              <p className="text-3xl font-bold">{stats?.companiesCount || 0}</p>
            </div>
            <Building2 className="w-12 h-12 text-orange-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Application Funnel */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-gray-600 mb-1">New</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStats.newApplications || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-600 mb-1">Reviewing</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStats.reviewing || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
          <p className="text-xs text-gray-600 mb-1">Shortlisted</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStats.shortlisted || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-600 mb-1">Interviewed</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStats.interviewed || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-600 mb-1">Accepted</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStats.accepted || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <p className="text-xs text-gray-600 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStats.rejected || 0}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/recruiter/ats"
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Users className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Applicant Tracking</h3>
          <p className="text-blue-100 text-sm mb-3">Manage applications with Kanban board</p>
          <span className="text-sm font-medium">Open ATS →</span>
        </Link>

        <Link
          to="/recruiter/interviews"
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <Calendar className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Interviews</h3>
          <p className="text-green-100 text-sm mb-3">
            {stats?.upcomingInterviews?.length || 0} upcoming interviews
          </p>
          <span className="text-sm font-medium">View Schedule →</span>
        </Link>

        <Link
          to="/recruiter/analytics"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <TrendingUp className="w-10 h-10 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Analytics</h3>
          <p className="text-purple-100 text-sm mb-3">View hiring metrics and insights</p>
          <span className="text-sm font-medium">View Analytics →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-green-600" />
              Upcoming Interviews
            </h2>
            <Link
              to="/recruiter/interviews"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {stats?.upcomingInterviews && stats.upcomingInterviews.length > 0 ? (
            <div className="space-y-3">
              {stats.upcomingInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{interview.candidate?.username}</h3>
                      <p className="text-sm text-gray-600">{interview.job?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(interview.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {interview.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No upcoming interviews</p>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Recent Applications
            </h2>
            <Link
              to="/recruiter/ats"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {stats?.recentApplications && stats.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {stats.recentApplications.slice(0, 5).map((application) => (
                <div
                  key={application._id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {application.applicant?.username}
                      </h3>
                      <p className="text-sm text-gray-600">{application.job?.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'shortlisted'
                          ? 'bg-purple-100 text-purple-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No recent applications</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Jobs */}
      {stats?.topJobs && stats.topJobs.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            Top Performing Jobs
          </h2>
          <div className="space-y-3">
            {stats.topJobs.map((job, index) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">{job.applicationCount}</p>
                  <p className="text-xs text-gray-600">applications</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
