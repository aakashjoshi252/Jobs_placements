import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, MapPin, Briefcase, DollarSign, Bookmark, ExternalLink } from 'lucide-react';

const JobRecommendations = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecommendations();
  }, [page]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/candidate/recommendations?page=${page}&limit=12`,
        { withCredentials: true }
      );
      setJobs(data.data);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/candidate/saved-jobs`,
        { jobId },
        { withCredentials: true }
      );
      alert('Job saved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save job');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Recommended For You</h1>
        </div>
        <p className="text-gray-600">Jobs matching your skills and preferences</p>
      </div>

      {/* Jobs Grid */}
      {jobs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Company Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    {job.company?.logo && (
                      <img
                        src={job.company.logo}
                        alt={job.company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{job.company?.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.company?.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{job.title}</h2>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.jobType}</span>
                      <span className="text-gray-400">•</span>
                      <span>{job.experience}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>

                    {job.salaryMin && job.salaryMax && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>
                          ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.requirements?.slice(0, 3).map((req, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                      {job.requirements?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                      View Details
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleSaveJob(job._id)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Save Job"
                    >
                      <Bookmark className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
          <p className="text-gray-600 mb-4">Complete your profile to get personalized job recommendations</p>
          <Link
            to="/profile"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;
