import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { applicationApi } from "../../../../api/api";

export default function CandidateView() {
  const { applicationId } = useParams();
  const { token } = useSelector((state) => state.auth);

  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState("");

  const fetchData = async () => {
    try {
      const res = await applicationApi.get(`/applications/${applicationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplication(res.data.application);
      setNotes(res.data.application?.recruiterNote || "");
    } catch (err) {
      console.error("Error fetching application:", err);
    }
  };

  const approve = async () => {
    try {
      const res = await applicationApi.patch(
        `/applications/approve/${applicationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplication(res.data.application);
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  const reject = async () => {
    try {
      const res = await applicationApi.patch(
        `/applications/reject/${applicationId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setApplication(res.data.application);
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [applicationId]);

  if (!application)
    return <h2 className="text-center p-6 text-xl">Loading...</h2>;

  const user = application.candidate;
  const resume = application.resume;
  const job = application.job;

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 border border-gray-200">

        {/* Candidate Info */}
        <h2 className="text-3xl font-semibold text-gray-900">
          {resume?.fullName || user?.username}
        </h2>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-lg font-medium text-blue-700 mt-1">
          {resume?.jobTitle}
        </p>

        {/* Job */}
        <section className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800">Applied For</h3>
          <p className="text-gray-700 mt-1">{job?.title}</p>
        </section>

        {/* STATUS (READ-ONLY BADGE) */}
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

        {/* ACTION BUTTONS */}
        {application.status === "PENDING" && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={approve}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Approve
            </button>

            <button
              onClick={reject}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
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
            className="w-full mt-2 border border-gray-300 rounded-lg p-3 min-h-[120px]"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal notes (optional)"
          />

          {/* NOTE SAVE CAN BE ADDED LATER */}
        </section>

      </div>
    </div>
  );
}
