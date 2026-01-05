import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {blogApi} from "../../../api/api"
import { formatDistanceToNow } from "date-fns";
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiNewspaper,
  HiCalendar,
  HiOfficeBuilding,
  HiTrendingUp,
  HiUserGroup,
  HiStar,
  HiSearch,
  HiFilter
} from "react-icons/hi";

export default function CompanyBlogList() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
    const company = useSelector((state) => state.company.data);

  console.log(blogs)
  console.log(company?._id)

  useEffect(() => {
    fetchCompanyBlogs();
  }, []);

  const fetchCompanyBlogs = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await blogApi.get(`/company/${company?._id}`);
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      // Fallback to demo data
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;

    try {
      await blogApi.delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter(blog => blog._id !== blogId));
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Posts", icon: <HiNewspaper /> },
    { value: "event", label: "Events", icon: <HiCalendar /> },
    { value: "achievement", label: "Achievements", icon: <HiStar /> },
    { value: "growth", label: "Growth Stories", icon: <HiTrendingUp /> },
    { value: "culture", label: "Company Culture", icon: <HiUserGroup /> },
    { value: "news", label: "Company News", icon: <HiOfficeBuilding /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <HiNewspaper className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Company Blog Posts</h1>
                <p className="text-emerald-100 mt-1">
                  Share your company's journey, achievements, and culture
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/recruiter/blogs/create")}
              className="px-6 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-semibold flex items-center gap-2 shadow-lg"
            >
              <HiPlus className="text-xl" />
              Create Blog Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Blog Posts
              </label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Posts" value={blogs.length} icon={<HiNewspaper />} color="blue" />
          <StatCard title="Published" value={blogs.filter(b => b.status === 'published').length} icon={<HiEye />} color="green" />
          <StatCard title="Drafts" value={blogs.filter(b => b.status === 'draft').length} icon={<HiPencil />} color="yellow" />
          <StatCard title="This Month" value={blogs.filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth()).length} icon={<HiCalendar />} color="purple" />
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredBlogs.length}</span> of{" "}
            <span className="font-semibold">{blogs.length}</span> blog posts
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HiNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {blogs.length === 0 ? "No blog posts yet" : "No posts match your filters"}
            </h3>
            <p className="text-gray-600 mb-6">
              {blogs.length === 0
                ? "Start sharing your company's story by creating your first blog post"
                : "Try adjusting your search or filters"}
            </p>
            {blogs.length === 0 && (
              <button
                onClick={() => navigate("/recruiter/blogs/create")}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold inline-flex items-center gap-2"
              >
                <HiPlus />
                Create Your First Blog Post
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map(blog => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onEdit={() => navigate(`/recruiter/blogs/edit/${blog._id}`)}
                onDelete={() => handleDelete(blog._id)}
                onView={() => navigate(`/blogs/${blog._id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    yellow: "from-yellow-500 to-yellow-600",
    purple: "from-purple-500 to-purple-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-xl text-white mb-2 shadow-lg`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-600 font-medium mt-1">{title}</div>
    </div>
  );
}

function BlogCard({ blog, onEdit, onDelete, onView }) {
  const getCategoryColor = (category) => {
    const colors = {
      event: "bg-blue-100 text-blue-700",
      achievement: "bg-yellow-100 text-yellow-700",
      growth: "bg-green-100 text-green-700",
      culture: "bg-purple-100 text-purple-700",
      news: "bg-pink-100 text-pink-700"
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      event: <HiCalendar />,
      achievement: <HiStar />,
      growth: <HiTrendingUp />,
      culture: <HiUserGroup />,
      news: <HiOfficeBuilding />
    };
    return icons[category] || <HiNewspaper />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition group overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={blog.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.status === 'published' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
            {blog.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(blog.category)}`}>
            {getCategoryIcon(blog.category)}
            {blog.category}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <HiCalendar />
            {formatDistanceToNow(new Date(blog.createdAt || Date.now()), { addSuffix: true })}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {blog.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          <button
            onClick={onView}
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm flex items-center justify-center gap-1"
          >
            <HiEye />
            View
          </button>
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-medium text-sm flex items-center justify-center gap-1"
          >
            <HiPencil />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm flex items-center justify-center"
          >
            <HiTrash />
          </button>
        </div>
      </div>
    </div>
  );
}