import Carousel from "../../../components/carousel/Carousel";
import Jobs from "../../candidates/jobs/Jobs";
export default function Home() {
  const categories = [
    { name: "Goldsmith / Silversmith", icon: "" },
    { name: "Gemstone Setter (or Stone Setter)", icon: "" },
    { name: "Engraver", icon: "" },
    { name: "Polisher", icon: "" },
    { name: "Caster / Molder", icon: "" },
    { name: "Jewellery Designer", icon: "" },
    { name: "CAD/CAM Technician", icon: "" },
    { name: "Apprentice Jeweler", icon: "" },
    { name: "Model Maker:", icon: "" },
    { name: "Karigar", icon: "" },
    { name: "Apprentice Jeweler", icon: "" },
  ];

  const featuredJobs = [
    { title: "Gemstone Setter", company: "Tech Innovators", location: "Bengaluru, India" },
    { title: "Engraver", company: "Creative Studio", location: "Mumbai, India" },
    { title: "Polisher", company: "GrowthGuru", location: "Delhi, India" },
  ];

  const stats = {
    jobs: 1200,
    companies: 350,
    candidates: 8000,
  };

  return (
    <div className="home w-full mt-6">

      <Carousel />

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r mt-10 from-gray-400 to-gray-400 py-20 text-center text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-3">Find Your Dream Job</h1>
          <p className="text-lg opacity-90 mb-8">
            Search thousands of job opportunities from top companies
          </p>

          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              className="px-4 py-3 rounded-md text-black w-full md:w-80"
              type="text"
              placeholder="Job title, keyword or company"
            />
            <input
              className="px-4 py-3 rounded-md text-black w-full md:w-60"
              type="text"
              placeholder="Location"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-md hover:bg-gray-200"
            >
              Search Jobs
            </button>
          </form>
        </div>
      </section>

      <Jobs />

      {/* Categories */}
      <section className="py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Popular Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="border rounded-lg p-4 text-center shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <div className="text-4xl">{cat.icon}</div>
              <div className="mt-2 font-medium">{cat.name}</div>
            </div>
          ))}
        </div>
      </section>

      <Jobs />

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Jobs</h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredJobs.map((job, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-lg shadow hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-blue-600 font-medium mt-1">{job.location}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 flex flex-wrap justify-center gap-8 bg-white">
        <div className="text-center">
          <h3 className="text-4xl font-bold text-blue-600">{stats.jobs}+</h3>
          <p className="text-gray-700">Jobs</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold text-blue-600">{stats.companies}+</h3>
          <p className="text-gray-700">Companies</p>
        </div>
        <div className="text-center">
          <h3 className="text-4xl font-bold text-blue-600">{stats.candidates}+</h3>
          <p className="text-gray-700">Candidates</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

        <div className="flex flex-col md:flex-row justify-center gap-10 max-w-4xl mx-auto">
          {[1, 2, 3].map((step) => (
            <div key={step} className="text-center">
              <div className="w-16 h-16 mx-auto flex items-center justify-center bg-blue-600 text-white text-2xl rounded-full font-bold">
                {step}
              </div>
              <p className="mt-4 font-medium text-gray-700">
                {step === 1 ? "Search for jobs" : step === 2 ? "Apply & Connect" : "Get hired"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-orange-600 text-white">
        <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Career?</h2>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200">
          Get Started
        </button>
      </section>

    </div>
  );
}
