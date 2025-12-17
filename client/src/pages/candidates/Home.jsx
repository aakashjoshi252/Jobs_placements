import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../../../api/api";
import Jobs from "./jobs/Jobs";

export default function CandidateHome() {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.get("/candidate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data.data);
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

      <div className="grid md:grid-cols-5 gap-5 ">
        <Card title="Applied Jobs" value={stats?.totalApplications || 0 }  />
        <Card title="Pending" value={stats?.pending || 0} />
        <Card title="Shortlisted" value={stats?.shortlisted || 0} />
        <Card title="Approved" value={stats?.selected || 0} />
        <Card title="Rejected" value={stats?.rejected || 0} />
      </div>
      <div className="grid  mt-10">
        <Jobs/>
      </div>
    </div>
    
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-semibold">{value}</h2>
    </div>
  );
}
