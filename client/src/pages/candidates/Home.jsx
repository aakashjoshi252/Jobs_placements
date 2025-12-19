import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../../../api/api";
import Jobs from "./jobs/Jobs";
import { useNavigate } from "react-router-dom";
export default function CandidateHome() {
  const navigate= useNavigate()
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
      <div className="flex items-center justify-between mb-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          Candidate Dashboard
        </h1>

        {/* Navigation */}
        <ul className="flex items-center gap-4">
          <li>
            <button onClick={()=>navigate("/chat")} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              Chats
            </button>
          </li>

          <li>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
              Notifications
            </button>
          </li>

          <li>
            <button onClick={()=>navigate(`/candidate/resume`)} className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition">
              Resume
            </button>
          </li>
        </ul>
      </div>

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
