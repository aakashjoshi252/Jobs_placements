import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { applicationApi } from "../../../../api/api";

export default function CandidateProfile() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PROFILE =================
  const fetchCandidateProfile = async (applicationId) => {
    try {
      const res = await applicationApi.get(
        `/candidatedata/${applicationId}`
      );
      setCandidate(res.data.candidateData);
      setResume(res.data.resumeData);
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateProfile(applicationId);
  }, [applicationId]);

  if (loading) {
    return (
      <div className="text-center py-10 text-lg text-gray-600">
        Loading candidate profile...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-10 text-red-600">
        Candidate not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {candidate.username}
            </h1>
            <p className="text-gray-600">{candidate.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Joined on{" "}
              {new Date(candidate.createdAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
        </div>

        {/* ================= BASIC INFO ================= */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Candidate Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Phone:</strong> {candidate.phone || "N/A"}</p>
            <p><strong>Role:</strong> {candidate.role}</p>
          </div>
        </div>

        {/* ================= RESUME ================= */}
        {resume && (
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Resume Details
            </h2>

            <p className="text-lg font-medium text-gray-900">
              {resume.fullName}
            </p>
            <p className="text-gray-600">{resume.jobTitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Experience:</strong> {resume.experience} years</p>
              <p><strong>Location:</strong> {resume.location}</p>
            </div>

            <p className="text-gray-700">
              <strong>Summary:</strong>{" "}
              {resume.summary || "No summary provided"}
            </p>

            {/* Skills */}
            {resume.skills?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mt-4 mb-2">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Resume Link */}
            {resume.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Download Resume
              </a>
            )}
          </div>
        )}

        {/* ================= EDUCATION ================= */}
        {resume?.education?.length > 0 && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Education
            </h2>

            <ul className="space-y-3">
              {resume.education.map((edu, idx) => (
                <li key={idx} className="text-gray-700">
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-sm text-gray-500">
                    {edu.institution} ({edu.year})
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
