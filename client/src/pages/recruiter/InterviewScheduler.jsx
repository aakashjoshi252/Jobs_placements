import { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, MapPin, Video, Phone, Building, Plus, Edit, Trash2 } from 'lucide-react';

const InterviewScheduler = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState([]);
  const [formData, setFormData] = useState({
    applicationId: '',
    type: 'video',
    scheduledAt: '',
    duration: 60,
    location: '',
    notes: '',
  });

  useEffect(() => {
    fetchInterviews();
    fetchApplications();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/recruiter/interviews`,
        { withCredentials: true }
      );
      setInterviews(data.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/recruiter/ats`,
        { withCredentials: true }
      );
      // Get shortlisted applications
      setApplications(data.data?.shortlisted || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/recruiter/interviews`,
        formData,
        { withCredentials: true }
      );
      fetchInterviews();
      setShowForm(false);
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/recruiter/interviews/${id}`,
        { status },
        { withCredentials: true }
      );
      fetchInterviews();
    } catch (error) {
      alert('Failed to update interview');
    }
  };

  const resetForm = () => {
    setFormData({
      applicationId: '',
      type: 'video',
      scheduledAt: '',
      duration: 60,
      location: '',
      notes: '',
    });
  };

  const getInterviewIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'in-person':
        return <Building className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group interviews by date
  const groupedInterviews = interviews.reduce((groups, interview) => {
    const date = new Date(interview.scheduledAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(interview);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Interview Scheduler</h1>
          </div>
          <p className="text-gray-600">Manage and schedule candidate interviews</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Schedule Interview
        </button>
      </div>

      {/* Schedule Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Schedule New Interview</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Candidate *
              </label>
              <select
                value={formData.applicationId}
                onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a candidate...</option>
                {applications.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.applicant?.username} - {app.job?.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interview Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in-person">In-Person</option>
                  <option value="technical">Technical Round</option>
                  <option value="hr">HR Round</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="15"
                  max="300"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date and Time *
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location / Meeting Link
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Zoom link, office address, or phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Additional information for the candidate..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Schedule Interview
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interviews Timeline */}
      {Object.keys(groupedInterviews).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedInterviews).map(([date, dateInterviews]) => (
            <div key={date}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{date}</h2>
              <div className="space-y-3">
                {dateInterviews.map((interview) => (
                  <div
                    key={interview._id}
                    className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-green-100 rounded-lg">
                            {getInterviewIcon(interview.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {interview.candidate?.username}
                            </h3>
                            <p className="text-sm text-gray-600">{interview.job?.title}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(interview.scheduledAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span>({interview.duration} min)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span className="truncate">{interview.location || 'Not specified'}</span>
                          </div>
                          <div>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                getStatusColor(interview.status)
                              }`}
                            >
                              {interview.status}
                            </span>
                          </div>
                        </div>

                        {interview.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {interview.notes}
                          </p>
                        )}
                      </div>

                      {interview.status === 'scheduled' && (
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleUpdateStatus(interview._id, 'completed')}
                            className="px-3 py-1 bg-green-50 text-green-600 rounded hover:bg-green-100 text-sm"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(interview._id, 'cancelled')}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="pt-3 border-t border-gray-200 flex gap-4 text-sm text-gray-600">
                      <span>📧 {interview.candidate?.email}</span>
                      {interview.candidate?.phone && <span>📞 {interview.candidate.phone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Interviews Scheduled</h3>
          <p className="text-gray-600 mb-4">Schedule your first interview with a candidate</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Schedule Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
