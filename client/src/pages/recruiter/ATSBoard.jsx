import { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { User, Mail, Phone, ExternalLink, FileText, MessageSquare } from 'lucide-react';

const ATSBoard = () => {
  const [board, setBoard] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  const columns = [
    { id: 'pending', title: 'New', color: 'bg-yellow-50 border-yellow-200' },
    { id: 'reviewing', title: 'Reviewing', color: 'bg-blue-50 border-blue-200' },
    { id: 'shortlisted', title: 'Shortlisted', color: 'bg-purple-50 border-purple-200' },
    { id: 'interviewed', title: 'Interviewed', color: 'bg-indigo-50 border-indigo-200' },
    { id: 'accepted', title: 'Accepted', color: 'bg-green-50 border-green-200' },
    { id: 'rejected', title: 'Rejected', color: 'bg-red-50 border-red-200' },
  ];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0 && !selectedJob) {
      setSelectedJob(jobs[0]._id);
    }
  }, [jobs]);

  useEffect(() => {
    if (selectedJob) {
      fetchATSBoard();
    }
  }, [selectedJob]);

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/job`,
        { withCredentials: true }
      );
      setJobs(data.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchATSBoard = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/recruiter/ats?jobId=${selectedJob}`,
        { withCredentials: true }
      );
      setBoard(data.data);
    } catch (error) {
      console.error('Error fetching ATS board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId) return;

    // Update UI optimistically
    const newBoard = { ...board };
    const sourceColumn = [...newBoard[source.droppableId]];
    const destColumn = [...newBoard[destination.droppableId]];

    const [movedApp] = sourceColumn.splice(source.index, 1);
    destColumn.splice(destination.index, 0, movedApp);

    newBoard[source.droppableId] = sourceColumn;
    newBoard[destination.droppableId] = destColumn;
    setBoard(newBoard);

    // Update backend
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/recruiter/applications/${draggableId}/status`,
        { status: destination.droppableId },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert on error
      fetchATSBoard();
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
    <div className="max-w-full px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Tracking System</h1>
        
        {/* Job Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Job:</label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className={`rounded-lg border-2 ${column.color} overflow-hidden`}>
                {/* Column Header */}
                <div className="p-4 bg-white border-b-2">
                  <h3 className="font-bold text-gray-900">{column.title}</h3>
                  <p className="text-sm text-gray-600">
                    {board?.[column.id]?.length || 0} applications
                  </p>
                </div>

                {/* Column Content */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 min-h-[calc(100vh-300px)] ${
                        snapshot.isDraggingOver ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="space-y-3">
                        {board?.[column.id]?.map((application, index) => (
                          <Draggable
                            key={application._id}
                            draggableId={application._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-move hover:shadow-lg transition-shadow ${
                                  snapshot.isDragging ? 'rotate-2 scale-105' : ''
                                }`}
                                onClick={() => setSelectedApplication(application)}
                              >
                                {/* Candidate Info */}
                                <div className="flex items-center gap-3 mb-3">
                                  {application.applicant?.profile?.profilePhoto ? (
                                    <img
                                      src={application.applicant.profile.profilePhoto}
                                      alt={application.applicant.username}
                                      className="w-10 h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {application.applicant?.username}
                                    </h4>
                                    <p className="text-xs text-gray-600">
                                      {application.job?.title}
                                    </p>
                                  </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-1 text-xs text-gray-600 mb-3">
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{application.applicant?.email}</span>
                                  </div>
                                  {application.applicant?.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-3 h-3" />
                                      <span>{application.applicant.phone}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Skills */}
                                {application.applicant?.profile?.skills && (
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {application.applicant.profile.skills.slice(0, 3).map((skill, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                  {application.applicant?.profile?.resume && (
                                    <a
                                      href={application.applicant.profile.resume}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 text-center px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100 transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <FileText className="w-3 h-3 inline mr-1" />
                                      Resume
                                    </a>
                                  )}
                                  <button
                                    className="flex-1 px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded hover:bg-gray-100 transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedApplication(application);
                                    }}
                                  >
                                    <MessageSquare className="w-3 h-3 inline mr-1" />
                                    Notes
                                  </button>
                                </div>

                                <p className="text-xs text-gray-500 mt-2">
                                  Applied {new Date(application.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedApplication.applicant?.username}
                  </h2>
                  <p className="text-gray-600">{selectedApplication.job?.title}</p>
                </div>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Full application details here */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <p className="text-sm text-gray-600">{selectedApplication.applicant?.email}</p>
                  <p className="text-sm text-gray-600">{selectedApplication.applicant?.phone}</p>
                </div>

                {selectedApplication.coverLetter && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cover Letter</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedApplication.coverLetter}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSBoard;
