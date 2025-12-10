import Jobs from "./jobs/Jobs";

export default function EmployeeHome() {
  const appliedJobs = [
    { title: "Frontend Developer", company: "ABC Tech", date: "20 Nov 2025" },
    { title: "React Intern", company: "CodeCraft", date: "18 Nov 2025" },
    { title: "UI/UX Designer", company: "DesignHub", date: "15 Nov 2025" },
  ];

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Right Section */}
      <div className="flex-1 p-1">
        
        {/* Page Title */}
        <h1 className="text-3xl font-semibold mb-6">Welcome Employee</h1>

        {/* Applied Jobs Card */}
        <div className=" rounded-lg  p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Jobs Applied</h2>

          <ul className="space-y-3">
            {appliedJobs.map((job, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md border"
              >
                <span className="font-medium">{job.title}</span>
                <span className="text-gray-600">{job.company}</span>
                <span className="text-sm text-gray-500">{job.date}</span>
              </li>
            ))}
          </ul>

          {/* Jobs To Apply */}
          <h2 className="text-xl font-semibold mt-8 mb-3">JOBS TO APPLY</h2>

          <div className="bg-white rounded-lg shadow p-4 border">
            <Jobs />
          </div>
        </div>
      </div>
    </div>
  );
}
