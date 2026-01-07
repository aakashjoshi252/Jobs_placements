import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Bookmark, Trash2, ExternalLink, MapPin, Briefcase, DollarSign, Edit } from 'lucide-react';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/candidate/saved-jobs?limit=50`,
        { withCredentials: true }
      );
      setSavedJobs(data.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm('Remove this job from saved list?')) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/candidate/saved-jobs/${id}`,
        { withCredentials: true }
      );
      setSavedJobs(savedJobs.filter((job) => job._id !== id));
    } catch (error) {
      alert('Failed to remove job');
    }
  };

  const handleEdit = (savedJob) => {
    setEditingJob(savedJob._id);
    setNotes(savedJob.notes || '');
    setPriority(savedJob.priority || 'medium');
  };

  const handleUpdate = async (id) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/candidate/saved-jobs/${id}`,
        { notes, priority },
        { withCredentials: true }
      );
      setSavedJobs(savedJobs.map((job) => (job._id === id ? data.data : job)));
      setEditingJob(null);
    } catch (error) {
      alert('Failed to update');
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
          <Bookmark className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
        </div>
        <p className="text-gray-600">{savedJobs.length} jobs saved for later</p>
      </div>

      {/* Saved Jobs List */}
      {savedJobs.length > 0 ? (
        <div className="space-y-4">
          {savedJobs.map((savedJob) => {
            const job = savedJob.job;
            const isEditing = editingJob === savedJob._id;

            return (
              <div
                key={savedJob._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {job?.company?.logo && (
                          <img
                            src={job.company.logo}
                            alt={job.company.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">{job?.title}</h2>
                          <p className="text-gray-600">{job?.company?.name}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job?.jobType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job?.location}</span>
                        </div>
                        {job?.salaryMin && job?.salaryMax && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>
                              ₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Priority Badge */}
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            savedJob.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : savedJob.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {savedJob.priority.toUpperCase()} Priority
                        </span>
                      </div>

                      {/* Edit Form */}
                      {isEditing ? (
                        <div className="bg-gray-50 p-4 rounded-lg mb-3">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Notes
                            </label>
                            <textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="3"
                              placeholder="Add your notes..."
                            />
                          </div>
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Priority
                            </label>
                            <select
                              value={priority}
                              onChange={(e) => setPriority(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdate(savedJob._id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingJob(null)}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        savedJob.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-3">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Notes:</span> {savedJob.notes}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(savedJob)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemove(savedJob._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* View Job Button */}
                  <Link
                    to={`/jobs/${job?._id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View Job Details
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <p className="text-xs text-gray-500 mt-3">
                    Saved {new Date(savedJob.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Jobs</h3>
          <p className="text-gray-600 mb-4">Start saving jobs you're interested in</p>
          <Link
            to="/jobs"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
