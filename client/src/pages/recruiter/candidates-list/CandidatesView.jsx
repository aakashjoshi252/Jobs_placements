import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";

export default function CandidateView() {
  const { applicationId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const jobId = sessionStorage.getItem("selectedJob");

  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState("");

  // ---------------- FETCH APPLICATION ----------------
  const fetchApplication = async () => {
    if (!applicationId) return;

    try {
      const res = await applicationApi.get(
        `/candidatedata/${applicationId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplication(res.data.data);
      setNotes(res.data.application?.recruiterNote || "");
    } catch (err) {
      console.error("Fetch application error:", err);
    }
  };

  // ---------------- STATUS ACTIONS ----------------
  const approve = async () => {
    try {
      const res = await applicationApi.patch(
        `/status/${applicationId}`,
        { recruiterNote: notes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplication(res.data.application);
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  if (!application) {
    return (
      <h2 className="text-center p-6 text-xl text-gray-600">
        Loading application...
      </h2>
    );
  }

  const candidate = application.candidate;
  const resume = application.resume;
  const job = application.job;

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 border">

        {/* Candidate Info */}
        <h2 className="text-3xl font-semibold text-gray-900">
          {resume?.fullName || candidate?.username}
        </h2>
        <p className="text-gray-600">{candidate?.email}</p>
        <p className="text-lg font-medium text-blue-700 mt-1">
          {resume?.jobTitle}
        </p>

        {/* Job Info */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Applied For
          </h3>
          <p className="text-gray-700 mt-1">{job?.title}</p>
        </section>

        {/* Status */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Status</h3>

          <span
            className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-medium
              ${
                application.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : application.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {application.status}
          </span>
        </section>

        {/* Actions */}
        {application.status === "PENDING" && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={approve}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Approve
            </button>

            <button
              onClick={reject}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}

        {/* Notes */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Recruiter Notes
          </h3>

          <textarea
            className="w-full mt-2 border rounded-lg p-3 min-h-[120px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes (optional)"
          />
        </section>
      </div>
    </div>
  );
}
