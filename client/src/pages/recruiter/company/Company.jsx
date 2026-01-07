import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOfficeBuilding, HiPencil, HiNewspaper, HiEye, HiHeart, HiClock } from "react-icons/hi";
import { blogApi } from "../../../api/api";
import { toast } from "react-toastify";

export default function CompanyView() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.data);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  console.log("Company data:", company);
  console.log("Logo URL:", company?.uploadLogo);

  // Fetch company blogs
  useEffect(() => {
    const fetchCompanyBlogs = async () => {
      if (!company?._id) return;
      
      try {
        setLoadingBlogs(true);
        const response = await blogApi.get(`/company/${company._id}?status=published`);
        const blogData = response?.data?.blogs || [];
        // Get only latest 3 blogs
        setBlogs(blogData.slice(0, 3));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoadingBlogs(false);
      }
    };

    fetchCompanyBlogs();
  }, [company?._id]);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HiOfficeBuilding className="text-7xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Company Profile</h2>
          <p className="text-gray-600 mb-6">Create your company profile to get started</p>
          <button
            onClick={() => navigate("/recruiter/company/registration")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Create Company Profile
          </button>
        </div>
      </div>
    );
  }

  const handleImageError = () => {
    console.error("Failed to load image:", company.uploadLogo);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log("Image loaded successfully:", company.uploadLogo);
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">
          About Your Company
        </h2>

        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Logo Section */}
              <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                {company.uploadLogo && !imageError ? (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    )}
                    <img
                      src={company.uploadLogo}
                      alt={`${company.companyName} Logo`}
                      className={`w-full h-full object-contain transition-opacity duration-300 ${
                        imageLoading ? 'opacity-0' : 'opacity-100'
                      }`}
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                      crossOrigin="anonymous"
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <HiOfficeBuilding className="text-5xl text-gray-400" />
                  </div>
                )}
              </div>

              {/* Company Name */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {company.companyName}
                </h3>
                {company.industry && (
                  <p className="text-blue-100 text-lg">{company.industry}</p>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={() => navigate(`/recruiter/company/edit/${company._id}`)}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold flex items-center gap-2 shadow-lg"
              >
                <HiPencil className="text-xl" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            {/* Grid Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <DetailCard label="Industry" value={company.industry} />
              <DetailCard label="Company Size" value={company.size} />
              <DetailCard label="Established Year" value={company.establishedYear} />
              <DetailCard label="Email" value={company.contactEmail} />
              <DetailCard label="Contact Number" value={company.contactNumber} />
              <DetailCard label="Location" value={company.location} />
            </div>

            {/* Website */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="font-semibold text-gray-900 mb-2">Website</p>
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all transition"
                >
                  {company.website}
                </a>
              ) : (
                <p className="text-gray-500">No website provided</p>
              )}
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="font-semibold text-gray-900 mb-2">About the Company</p>
              <p className="text-gray-700 leading-relaxed">
                {company.description || "No description added yet. Click 'Edit Profile' to add one."}
              </p>
            </div>

            {/* Debug Info (Remove in production) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs font-mono text-yellow-800">Debug Info:</p>
                <p className="text-xs font-mono text-yellow-800">Logo URL: {company.uploadLogo || 'Not set'}</p>
                <p className="text-xs font-mono text-yellow-800">Image Error: {imageError ? 'Yes' : 'No'}</p>
                <p className="text-xs font-mono text-yellow-800">Image Loading: {imageLoading ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Latest Blogs Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <HiNewspaper className="text-3xl text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Latest Blog Posts</h3>
            </div>
            <button
              onClick={() => navigate("/recruiter/blogs")}
              className="text-blue-600 hover:text-blue-800 font-semibold transition flex items-center gap-2"
            >
              View All Blogs →
            </button>
          </div>

          {loadingBlogs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <HiNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">No Blogs Yet</h4>
              <p className="text-gray-600 mb-6">Start sharing your company's story with the world!</p>
              <button
                onClick={() => navigate("/recruiter/blogs")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Write Your First Blog
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard
            title="Post a Job"
            description="Create new job openings"
            onClick={() => navigate("/recruiter/jobpost")}
            color="blue"
          />
          <ActionCard
            title="View Jobs"
            description="Manage posted jobs"
            onClick={() => navigate("/recruiter/postedjobs")}
            color="green"
          />
          <ActionCard
            title="Company Blogs"
            description="Share your story"
            onClick={() => navigate("/recruiter/blogs")}
            color="purple"
          />
        </div>
      </div>
    </div>
  );
}

// Blog Card Component
const BlogCard = ({ blog, navigate }) => {
  const [imgError, setImgError] = useState(false);
  
  const getCategoryColor = (category) => {
    const colors = {
      technology: "bg-blue-100 text-blue-800",
      culture: "bg-purple-100 text-purple-800",
      news: "bg-green-100 text-green-800",
      product: "bg-orange-100 text-orange-800",
      tutorial: "bg-pink-100 text-pink-800",
      career: "bg-indigo-100 text-indigo-800",
    };
    return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all cursor-pointer group transform hover:-translate-y-1"
    >
      {/* Blog Image */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        {blog.image && !imgError ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <HiNewspaper className="text-6xl text-gray-400" />
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </span>
        </div>
      </div>

      {/* Blog Content */}
      <div className="p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {blog.title}
        </h4>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {blog.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <HiEye className="text-lg" />
              {blog.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <HiHeart className="text-lg" />
              {blog.likes || 0}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs">
            <HiClock className="text-base" />
            {formatDate(blog.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Reusable Detail Card Component
const DetailCard = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
    <p className="text-lg font-semibold text-gray-900">
      {value || <span className="text-gray-400">Not provided</span>}
    </p>
  </div>
);

// Action Card Component
const ActionCard = ({ title, description, onClick, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
  };

  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r ${colorClasses[color]} text-white p-6 rounded-xl shadow-lg transition-all transform hover:scale-105 text-left`}
    >
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
};
