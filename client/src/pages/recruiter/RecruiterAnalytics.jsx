import { useEffect, useState } from 'react';
import axios from 'axios';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/recruiter/analytics?period=${period}`,
        { withCredentials: true }
      );
      setAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
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

  const funnelData = analytics?.funnel || [];
  const getFunnelCount = (status) => {
    return funnelData.find((f) => f._id === status)?.count || 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Recruitment Analytics</h1>
          </div>
          <p className="text-gray-600">Track your hiring metrics and performance</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Applications</p>
              <p className="text-3xl font-bold">
                {funnelData.reduce((sum, f) => sum + f.count, 0)}
              </p>
            </div>
            <Users className="w-12 h-12 text-blue-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Acceptance Rate</p>
              <p className="text-3xl font-bold">
                {funnelData.length > 0
                  ? Math.round(
                      (getFunnelCount('accepted') /
                        funnelData.reduce((sum, f) => sum + f.count, 0)) *
                        100
                    )
                  : 0}
                %
              </p>
            </div>
            <Target className="w-12 h-12 text-green-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Avg. Time to Hire</p>
              <p className="text-3xl font-bold">{analytics?.avgTimeToHire || 0}</p>
              <p className="text-purple-100 text-xs">days</p>
            </div>
            <Clock className="w-12 h-12 text-purple-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm mb-1">Hires</p>
              <p className="text-3xl font-bold">{getFunnelCount('accepted')}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-orange-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Application Funnel */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Application Funnel</h2>
        <div className="space-y-4">
          {[
            { status: 'pending', label: 'New Applications', color: 'bg-yellow-500' },
            { status: 'reviewing', label: 'Under Review', color: 'bg-blue-500' },
            { status: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-500' },
            { status: 'interviewed', label: 'Interviewed', color: 'bg-indigo-500' },
            { status: 'accepted', label: 'Accepted', color: 'bg-green-500' },
          ].map((stage) => {
            const count = getFunnelCount(stage.status);
            const total = funnelData.reduce((sum, f) => sum + f.count, 0);
            const percentage = total > 0 ? (count / total) * 100 : 0;

            return (
              <div key={stage.status}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                  <span className="text-sm text-gray-600">
                    {count} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className={`${stage.color} h-4 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Application Trend */}
      {analytics?.applicationTrend && analytics.applicationTrend.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Application Trend</h2>
          <div className="space-y-3">
            {analytics.applicationTrend.map((trend) => (
              <div key={trend._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{trend._id}</span>
                <span className="text-lg font-bold text-blue-600">{trend.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterAnalytics;
