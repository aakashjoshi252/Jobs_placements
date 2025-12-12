import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { jobApi, applicationApi } from "../../../../../api/api";  // <-- Add when API ready

export default function RecruiterDashboard() {
  const loggedUser = useSelector((state) => state.auth.user);

  const [recruiter, setRecruiter] = useState(null);

  // Dashboard Data (later fetch from API)
  const [stats, setStats] = useState({
    postedJobs: 0,
    totalApplications: 0,
    activeJobs: 0,
    shortlisted: 0,
  });

  useEffect(() => {
    if (loggedUser?.role === "recruiter") {
      setRecruiter(loggedUser);
    }

    // TODO: fetchData();  <-- Replace dummy data with API call
    loadDummyStats();

  }, [loggedUser]);

  // Dummy Dashboard Data (Replace later with API)
  const loadDummyStats = () => {
    setStats({
      postedJobs: 12,
      totalApplications: 89,
      activeJobs: 7,
      shortlisted: 14,
    });
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Recruiter Dashboard
      </h2>

      {/* Welcome Box */}
      {recruiter && (
        <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 max-w-lg mb-10">
          <h3 className="text-xl font-semibold text-gray-700">
            Welcome, {recruiter.name || recruiter.email}
          </h3>
          <p className="text-gray-500 mt-2">
            Here is your hiring overview.
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Posted Jobs */}
        <DashboardCard
          title="Posted Jobs"
          value={stats.postedJobs}
          color="bg-blue-500"
        />

        {/* Applications */}
        <DashboardCard
          title="Total Applications"
          value={stats.totalApplications}
          color="bg-green-500"
        />

        {/* Active Jobs */}
        <DashboardCard
          title="Active Jobs"
          value={stats.activeJobs}
          color="bg-orange-500"
        />

        {/* Shortlisted */}
        <DashboardCard
          title="Shortlisted Candidates"
          value={stats.shortlisted}
          color="bg-purple-500"
        />

      </div>
    </div>
  );
}

/* Dashboard Card Component */
const DashboardCard = ({ title, value, color }) => (
  <div className="bg-white shadow-md border border-gray-200 rounded-xl p-5 flex flex-col items-start">
    <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-white text-xl ${color}`}>
      {value}
    </div>
    <h4 className="mt-4 text-lg font-semibold text-gray-800">{title}</h4>
  </div>
);
