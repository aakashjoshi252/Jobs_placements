import Jobs from "./jobs/Jobs";
import { useState } from "react";

export default function EmployeeHome() {
  // Dummy stats (replace with API later)
  const [stats, setStats] = useState({
    applied: 3,
    saved: 5,
    shortlisted: 2,
    recommended: 12,
  });


  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome Employee
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <DashboardCard title="Applied Jobs" value={stats.applied} color="bg-blue-500" />
        <DashboardCard title="Saved Jobs" value={stats.saved} color="bg-green-500" />
        <DashboardCard title="Shortlisted" value={stats.shortlisted} color="bg-purple-500" />
        <DashboardCard title="Recommended" value={stats.recommended} color="bg-orange-500" />
      </div>

      {/* Jobs to Apply */}
      <div className="bg-white border shadow-md rounded-xl p-6">
        <Jobs />
      </div>
    </div>
  );
}

/* Reusable Dashboard Card Component */
const DashboardCard = ({ title, value, color }) => (
  <div className="bg-white shadow-md border border-gray-200 rounded-xl p-5 flex flex-col">
    <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-xl ${color}`}>
      {value}
    </div>
    <h4 className="mt-4 text-lg font-semibold text-gray-800">{title}</h4>
  </div>
);
