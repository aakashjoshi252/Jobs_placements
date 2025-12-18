export default function JobFilters({ filters, setFilters }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Filter Jobs
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Job Title */}
        <input
          type="text"
          placeholder="Job title"
          value={filters.title}
          onChange={(e) =>
            setFilters({ ...filters, title: e.target.value })
          }
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Company */}
        <input
          type="text"
          placeholder="Company"
          value={filters.company}
          onChange={(e) =>
            setFilters({ ...filters, company: e.target.value })
          }
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Location */}
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
