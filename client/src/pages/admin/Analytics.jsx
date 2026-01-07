import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TrendingUp,
  Users,
  Building2,
  FileText,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/analytics`,
        {
          params: { period },
          withCredentials: true,
        }
      );
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const calculateTrend = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  };

  const userGrowthTrend = calculateTrend(
    analytics?.userGrowth?.currentPeriod,
    analytics?.userGrowth?.previousPeriod
  );

  const applicationTrend = calculateTrend(
    analytics?.applicationTrends?.currentPeriod,
    analytics?.applicationTrends?.previousPeriod
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-2">Platform performance insights</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={365}>Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Growth Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* User Growth */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">User Growth</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {analytics?.userGrowth?.currentPeriod || 0}
                </h3>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 ${
                userGrowthTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {userGrowthTrend >= 0 ? (
                <ArrowUp className="w-5 h-5" />
              ) : (
                <ArrowDown className="w-5 h-5" />
              )}
              <span className="font-bold">{Math.abs(userGrowthTrend).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            New users in the last {period} days
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Previous period: {analytics?.userGrowth?.previousPeriod || 0}
          </p>
        </div>

        {/* Application Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-3">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {analytics?.applicationTrends?.currentPeriod || 0}
                </h3>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 ${
                applicationTrend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {applicationTrend >= 0 ? (
                <ArrowUp className="w-5 h-5" />
              ) : (
                <ArrowDown className="w-5 h-5" />
              )}
              <span className="font-bold">{Math.abs(applicationTrend).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Applications submitted in the last {period} days
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Previous period: {analytics?.applicationTrends?.previousPeriod || 0}
          </p>
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-purple-100 rounded-lg mr-3">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Top Companies by Jobs</h2>
        </div>
        <div className="space-y-4">
          {analytics?.topCompanies?.length > 0 ? (
            analytics.topCompanies.map((company, index) => (
              <div
                key={company._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold mr-4">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{company._id}</p>
                    <p className="text-sm text-gray-500">Active company</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{company.count}</p>
                  <p className="text-sm text-gray-500">job postings</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Growth Rate</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {userGrowthTrend >= 0 ? '+' : ''}{userGrowthTrend.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500 mt-2">User growth vs previous period</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <Calendar className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Period</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">{period} days</p>
          <p className="text-sm text-gray-500 mt-2">Current analysis period</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-3">
            <Building2 className="w-5 h-5 text-purple-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Top Companies</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {analytics?.topCompanies?.length || 0}
          </p>
          <p className="text-sm text-gray-500 mt-2">Companies with active jobs</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
