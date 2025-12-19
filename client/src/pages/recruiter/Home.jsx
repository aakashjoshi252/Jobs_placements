import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dashboardApi } from "../../../api/api";
import {useNavigate} from "react-router-dom"
export default function RecruiterHome() {
  const { token } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await dashboardApi.get("/recruiter", {
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
          Recruiter Dashboard
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
            <button onClick={()=>navigate(`/recruiter/company/jobpost`)} className="px-4 py-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition">
              New Job
            </button>
          </li>
        </ul>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Jobs Posted" value={stats.totalJobs || 0} />
        <Card title="Total Applications" value={stats.totalApplications || 0} />
        <Card title="Pending" value={stats.pending || 0} />
        <Card title="Approved" value={stats.approved || 0} />
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
