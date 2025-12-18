import { useEffect, useState } from "react";
import Carousel from "../../../components/carousel/Carousel";
import Jobs from "../../candidates/jobs/Jobs";
import { jobsApi, dashboardApi } from "../../../../api/api";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate= useNavigate();
  const [categories, setCategories] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    candidates: 0,
  });

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
  });

  const fetchHomeData = async () => {
    try {
      const [
        jobsCountRes,
        companiesCountRes,
        candidatesCountRes,
        featuredJobsRes,
        categoriesRes,
      ] = await Promise.all([
        dashboardApi.get("/jobs/count"),
        dashboardApi.get("/companies/count"),
        dashboardApi.get("/candidates/count"),
        jobsApi.get("/featured"),
        jobsApi.get("/categories"),
      ]);

      setStats({
        jobs: jobsCountRes.data,
        companies: companiesCountRes.data,
        candidates: candidatesCountRes.data,
      });

      setFeaturedJobs(featuredJobsRes.data.jobs || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      console.error("Home data fetch error:", error);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const searchHandler = (e) => e.preventDefault();

  return (
    <div className="home w-full bg-gray-50">

      {/* ================= CAROUSEL ================= */}
      <Carousel />

      {/* ================= HERO ================= */}
      <section className="mt-10 py-20 text-center bg-gradient-to-r from-emerald-900 to-emerald-900 text-white">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-3">
            Find Your Dream Job
          </h1>
          <p className="text-lg opacity-90 mb-8">
            Search thousands of verified job opportunities
          </p>

          <form
            onSubmit={searchHandler}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <input
              className="px-4 py-3 rounded-md text-gray-800 w-full md:w-80 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
              type="text"
              placeholder="Job title or keyword"
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />
            <input
              className="px-4 py-3 rounded-md text-gray-800 w-full md:w-60 bg-white focus:ring-2 focus:ring-emerald-400 outline-none"
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
            />
            <button
              type="submit"
              className="bg-white text-emerald-700 font-semibold px-6 py-3 rounded-md hover:bg-emerald-100 transition"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      {/* ================= JOB LIST ================= */}
      <Jobs filters={filters} />

      {/* ================= CATEGORIES ================= */}
      {categories.length > 0 && (
        <section className="py-16 max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
            Popular Categories
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="border bg-white rounded-xl p-5 text-center shadow-sm hover:shadow-md hover:border-emerald-500 transition cursor-pointer"
              >
                <div className="font-semibold text-slate-700">
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= FEATURED JOBS ================= */}
      {featuredJobs.length > 0 && (
        <section className="py-16 bg-emerald-50">
          <h2 className="text-3xl font-bold text-center mb-10 text-slate-800">
            Featured Jobs
          </h2>

          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div
                key={job._id}
                className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-xl font-bold text-slate-800">
                  {job.title}
                </h3>
                <p className="text-slate-600">{job.companyName}</p>
                <p className="text-emerald-600 font-medium mt-1">
                  {job.jobLocation}
                </p>
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
        <button onClick={()=>navigate("/login")} className="bg-white text-emerald-700 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-100 transition">
          Get Started
        </button>
      </section>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="text-center">
      <h3 className="text-4xl font-bold text-emerald-600">
        {value}+
      </h3>
      <p className="text-slate-700 font-medium">{label}</p>
    </div>
  );
}
