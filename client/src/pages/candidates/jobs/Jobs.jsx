import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { jobsApi } from "../../../api/api";
import Pagination from "../../../components/pagination/Pagination";
import { GiDiamondRing, GiJewelCrown, GiCutDiamond } from "react-icons/gi";
import { FaFilter, FaMapMarkerAlt, FaBriefcase, FaSearch } from "react-icons/fa";

const ITEMS_PER_PAGE = 9;

const JEWELRY_CATEGORIES = [
  "All Categories",
  "Jewelry Designer",
  "CAD Designer",
  "Manufacturing",
  "Goldsmith/Silversmith",
  "Stone Setting",
  "Gemologist",
  "Sales & Marketing",
  "Store Manager",
  "Quality Control",
  "Production"
];

const EXPERIENCE_LEVELS = [
  "All Levels",
  "Fresher",
  "1-3 years",
  "3-5 years",
  "5+ years"
];

const JOB_TYPES = [
  "All Types",
  "On-site",
  "Remote",
  "Hybrid"
];

export default function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    searchQuery: "",
    location: "",
    jewelryCategory: "All Categories",
    experience: "All Levels",
    jobType: "All Types",
    materialsExperience: [],
    certifications: []
  });

  // ================= FETCH JOBS =================
  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobsApi.get(`/`);
      setJobs(response.data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================= FILTER LOGIC =================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const searchQuery = filters.searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        job.title?.toLowerCase().includes(searchQuery) ||
        job.companyName?.toLowerCase().includes(searchQuery) ||
        job.description?.toLowerCase().includes(searchQuery);

      const matchesLocation = 
        !filters.location ||
        job.jobLocation?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesCategory = 
        filters.jewelryCategory === "All Categories" ||
        job.jewelryCategory === filters.jewelryCategory;

      const matchesExperience = 
        filters.experience === "All Levels" ||
        job.experience === filters.experience;

      const matchesJobType = 
        filters.jobType === "All Types" ||
        job.jobType === filters.jobType;

      return matchesSearch && matchesLocation && matchesCategory && matchesExperience && matchesJobType;
    });
  }, [jobs, filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      location: "",
      jewelryCategory: "All Categories",
      experience: "All Levels",
      jobType: "All Types",
      materialsExperience: [],
      certifications: []
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <GiJewelCrown className="text-6xl" />
            <div>
              <h1 className="text-4xl font-bold">Jewelry Industry Jobs</h1>
              <p className="text-blue-100 text-lg mt-2">
                {filteredJobs.length} opportunities in jewelry craftsmanship
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by job title, company, skills..."
                  value={filters.searchQuery}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div className="md:col-span-4 relative">
                <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location (e.g., Mumbai)"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                />
              </div>

              <div className="md:col-span-3 flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                >
                  <FaFilter />
                  Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <GiDiamondRing className="inline mr-1 text-blue-600" />
                    Jewelry Category
                  </label>
                  <select
                    value={filters.jewelryCategory}
                    onChange={(e) => handleFilterChange('jewelryCategory', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    {JEWELRY_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <FaBriefcase className="inline mr-1 text-purple-600" />
                    Experience Level
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    {EXPERIENCE_LEVELS.map(exp => (
                      <option key={exp} value={exp}>{exp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange('jobType', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    {JOB_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading jewelry jobs...</p>
          </div>
        ) : paginatedJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <GiCutDiamond className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 cursor-pointer group"
                onClick={() => navigate(`/candidate/CompanyAboutCard/${job._id}`)}
              >
                {/* Job Category Badge */}
                {job.jewelryCategory && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      <GiDiamondRing className="inline mr-1" />
                      {job.jewelryCategory}
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                  {job.title}
                </h3>

                <p className="text-gray-700 mb-3 flex items-center gap-2">
                  <span className="font-semibold text-blue-600">🏢</span>
                  {job.companyName}
                </p>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <FaMapMarkerAlt className="text-purple-600" />
                    {job.jobLocation}
                  </p>

                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <FaBriefcase className="text-green-600" />
                    {job.empType} • {job.experience}
                  </p>

                  {job.salary && (
                    <p className="text-gray-800 font-semibold text-sm">
                      💰 {job.salary}
                    </p>
                  )}
                </div>

                {/* Jewelry Specializations */}
                {job.jewelrySpecialization && job.jewelrySpecialization.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.jewelrySpecialization.slice(0, 3).map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                      {job.jewelrySpecialization.length > 3 && (
                        <span className="text-xs text-gray-600">+{job.jewelrySpecialization.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Materials */}
                {job.materialsExperience && job.materialsExperience.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Materials:</p>
                    <div className="flex flex-wrap gap-1">
                      {job.materialsExperience.slice(0, 3).map((material, idx) => (
                        <span
                          key={idx}
                          className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Apply Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/candidate/CompanyAboutCard/${job._id}`);
                  }}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
                >
                  💎 View Details & Apply
                </button>

                {/* Portfolio Required Badge */}
                {job.portfolioRequired && (
                  <p className="text-center text-xs text-purple-600 mt-2 font-semibold">
                    📁 Portfolio Required
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="bg-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
              <p className="text-gray-600 text-sm">Total Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">
                {jobs.filter(j => j.jewelryCategory).length}
              </p>
              <p className="text-gray-600 text-sm">Jewelry Roles</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {jobs.filter(j => j.experience === "Fresher").length}
              </p>
              <p className="text-gray-600 text-sm">Fresher Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-600">
                {jobs.filter(j => j.jobType === "Remote").length}
              </p>
              <p className="text-gray-600 text-sm">Remote Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
