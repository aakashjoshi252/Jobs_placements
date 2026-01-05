import { useEffect, useState } from "react";
import Carousel from "../../../components/carousel/Carousel";
import Jobs from "../../candidates/jobs/Jobs";
import { jobsApi, dashboardApi } from "../../../api/api";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState(null);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    candidates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ CORRECT FILTER STATE
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
  });

  // Helper function to safely extract number from response
  const safeExtractNumber = (data) => {
    // If it's already a number, return it
    if (typeof data === 'number') return data;
    
    // If it's an object with a count property
    if (data && typeof data === 'object') {
      if (typeof data.count === 'number') return data.count;
      if (typeof data.data === 'number') return data.data;
      if (typeof data.total === 'number') return data.total;
    }
    
    // Default to 0
    return 0;
  };

  // ================= FETCH HOME DATA =================
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        jobsCountRes,
        companiesCountRes,
        candidatesCountRes,
        featuredJobsRes,
        categoriesRes,
      ] = await Promise.all([
        dashboardApi.get("/jobs/count").catch(err => ({ data: 0 })),
        dashboardApi.get("/companies/count").catch(err => ({ data: 0 })),
        dashboardApi.get("/candidates/count").catch(err => ({ data: 0 })),
        jobsApi.get("/featured?limit=6").catch(err => ({ data: { success: false, data: [] } })),
        jobsApi.get("/categories").catch(err => ({ data: { success: false, data: null } })),
      ]);

      // Update stats with safe extraction
      setStats({
        jobs: safeExtractNumber(jobsCountRes.data),
        companies: safeExtractNumber(companiesCountRes.data),
        candidates: safeExtractNumber(candidatesCountRes.data),
      });

      // Update featured jobs - handle new API response structure
      if (featuredJobsRes.data?.success && Array.isArray(featuredJobsRes.data?.data)) {
        setFeaturedJobs(featuredJobsRes.data.data);
      } else if (Array.isArray(featuredJobsRes.data)) {
        // Fallback for direct array response
        setFeaturedJobs(featuredJobsRes.data);
      }

      // Update categories - handle new API response structure
      if (categoriesRes.data?.success && categoriesRes.data?.data) {
        setCategories(categoriesRes.data.data);
      } else if (categoriesRes.data && !categoriesRes.data.success) {
        // Handle direct data response
        setCategories(categoriesRes.data);
      }

    } catch (error) {
      console.error("Home data fetch error:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to load some data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <div className="home w-full bg-gray-50">

      {/* ================= CAROUSEL ================= */}
      <Carousel />

      {/* ================= HERO ================= */}
      <section className="mt-10 py-20 text-center bg-gradient-to-r from-emerald-900 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">
            Find Your Dream Job
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Search thousands of verified job opportunities
          </p>

          {/* 🔍 FILTER INPUTS */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              className="px-4 py-3 rounded-md text-gray-800 w-full md:w-72 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
              type="text"
              placeholder="Job title"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
            />

            <input
              className="px-4 py-3 rounded-md text-gray-800 w-full md:w-64 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
              type="text"
              placeholder="Company"
              value={filters.company}
              onChange={(e) =>
                setFilters({ ...filters, company: e.target.value })
              }
            />

            <input
              className="px-4 py-3 rounded-md text-gray-800 w-full md:w-56 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
          </div>
        </div>
      </section>

      {/* ================= ERROR MESSAGE ================= */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* ================= JOB LIST ================= */}
      <Jobs filters={filters} />

      {/* ================= POPULAR CATEGORIES BY EXPERIENCE ================= */}
      {!loading && categories?.experience && Array.isArray(categories.experience) && categories.experience.length > 0 && (
        <section className="py-16 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
            Browse by Experience Level
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.experience.map((cat, index) => (
              <div
                key={index}
                className="border bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer"
              >
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  {cat.count || 0}
                </div>
                <div className="font-semibold text-slate-700">
                  {cat.category || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= POPULAR SKILLS ================= */}
      {!loading && categories?.topSkills && Array.isArray(categories.topSkills) && categories.topSkills.length > 0 && (
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
              Top Skills in Demand
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              {categories.topSkills.slice(0, 10).map((skill, index) => (
                <div
                  key={index}
                  className="px-6 py-3 bg-white rounded-full border-2 border-emerald-500 hover:bg-emerald-500 hover:text-white transition cursor-pointer font-medium"
                >
                  {skill.skill || 'N/A'} ({skill.count || 0})
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* ================= JOB TYPES ================= */}
      {!loading && categories?.jobType && Array.isArray(categories.jobType) && categories.jobType.length > 0 && (
        <section className="py-16 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
            Job Types Available
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.jobType.map((type, index) => (
              <div
                key={index}
                className="border-2 bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg hover:border-emerald-500 transition cursor-pointer"
              >
                <div className="text-3xl font-bold text-emerald-600 mb-3">
                  {type.count || 0}
                </div>
                <div className="text-xl font-semibold text-slate-700">
                  {type.category || 'N/A'} Jobs
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= FEATURED JOBS ================= */}
      {!loading && Array.isArray(featuredJobs) && featuredJobs.length > 0 && (
        <section className="py-16 bg-emerald-50">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
            Featured Jobs
          </h2>

          <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="p-6 bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-emerald-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                      {job.title || 'Job Title'}
                    </h3>
                    <p className="text-slate-600 font-medium">{job.companyName || 'Company'}</p>
                  </div>
                  {job.openings > 1 && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                      {job.openings} openings
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-slate-600">
                  {job.jobLocation && (
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600">📍</span>
                      {job.jobLocation}
                    </p>
                  )}
                  {(job.jobType || job.empType) && (
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600">💼</span>
                      {job.jobType || ''} {job.jobType && job.empType && '•'} {job.empType || ''}
                    </p>
                  )}
                  {job.experience && (
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600">🎓</span>
                      {job.experience}
                    </p>
                  )}
                  {job.salary && (
                    <p className="flex items-center gap-2">
                      <span className="text-emerald-600">💰</span>
                      {job.salary}
                    </p>
                  )}
                </div>

                {job.skills && Array.isArray(job.skills) && job.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                        +{job.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= STATS ================= */}
      <section className="py-14 flex flex-wrap justify-center gap-12 bg-white">
        <StatBox label="Jobs" value={stats.jobs} />
        <StatBox label="Companies" value={stats.companies} />
        <StatBox label="Candidates" value={stats.candidates} />
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 text-center bg-emerald-900 text-white">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Grow Your Career?
        </h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-100 transition"
        >
          Get Started
        </button>
      </section>

      {/* ================= LOADING STATE ================= */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= STAT COMPONENT =================
function StatBox({ label, value }) {
  // Ensure value is a number
  const displayValue = typeof value === 'number' ? value : 0;
  
  return (
    <div className="text-center">
      <h3 className="text-4xl font-bold text-emerald-600">
        {displayValue}+
      </h3>
      <p className="text-slate-700 font-medium">{label}</p>
    </div>
  );
}