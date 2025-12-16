import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../../../api/api";

export default function CandidateHome() {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.get("/dashboard/candidate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    fetchStats();
  }, [token]);

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Applied Jobs" value={stats.totalApplied} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Approved" value={stats.approved} />
        <Card title="Rejected" value={stats.rejected} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-semibold">{value}</h2>
    </div>
  );
}
