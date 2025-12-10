import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { applicationApi } from "../../../../api/api";

export default function CandidateView() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [note, setNote] = useState("");

  const fetchData = async () => {
    try {
      const res = await applicationApi.get(`/candidatedata/${applicationId}`);
      setApplication(res.data);
      setNote(res.data.recruiterNote || "");
    } catch (err) {
      console.error("Error fetching:", err);
    }
  };

  const updateStatus = async (status) => {
    try {
      await applicationApi.put(`/status/${applicationId}`, { status });

      setApplication((prev) => ({
        ...prev,
        status,
        timeline: [
          ...prev.timeline,
          { status, date: new Date().toISOString() }
        ]
      }));
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const saveNote = async () => {
    try {
      await applicationApi.put(`/note/${applicationId}`, { note });
      alert("Note saved");
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  if (!application) return <h2 className="text-center p-6 text-xl">Loading...</h2>;

  const user = application.candidateId;
  const resume = application.resumeId;

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 border border-gray-200">

        {/* Candidate Name + Info */}
        <h2 className="text-3xl font-semibold text-gray-900">
          {resume?.fullName || user?.username}
        </h2>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-gray-600 mb-4">{user?.phone}</p>
        <p className="text-lg font-medium text-blue-700">{resume?.jobTitle}</p>

        {/* Applied Job */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Applied For</h3>
          <p className="text-gray-700 mt-1">{application.jobId?.title}</p>
        </section>

        {/* Status */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Status</h3>

          <select
            className="mt-2 w-full border border-gray-300 p-2 rounded-lg bg-white text-gray-900"
            value={application.status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview-Scheduled">Interview Scheduled</option>
            <option value="Rejected">Rejected</option>
            <option value="Selected">Approved</option>
          </select>
        </section>

        {/* Summary */}
        {resume?.summary && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Summary</h3>
            <p className="text-gray-700 mt-2 leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Skills */}
        {resume?.skills?.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {resume.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {resume?.experiences?.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Experience</h3>
            <ul className="mt-3 space-y-3">
              {resume.experiences.map((exp, i) => (
                <li key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <strong className="text-gray-900">{exp.experienceTitle}</strong> @{" "}
                  {exp.companyName}
                  <p className="text-gray-600">{exp.duration}</p>
                  <p className="text-gray-700">{exp.workDetails}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Education */}
        {resume?.education?.length > 0 && (
          <section className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Education</h3>
            <ul className="mt-3 space-y-3">
              {resume.education.map((edu, i) => (
                <li key={i} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <strong>{edu.degree}</strong> - {edu.institution}
                  <p className="text-gray-600">Year: {edu.year}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Notes */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Recruiter Notes</h3>
          <textarea
            className="w-full mt-2 border border-gray-300 rounded-lg p-3 min-h-[120px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes..."
          />
          <button
            onClick={saveNote}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save Notes
          </button>
        </section>

      </div>
    </div>
  );
}
