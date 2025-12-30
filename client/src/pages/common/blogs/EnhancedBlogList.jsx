import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  HiSearch,
  HiFilter,
  HiNewspaper,
  HiCalendar,
  HiStar,
  HiTrendingUp,
  HiUserGroup,
  HiOfficeBuilding,
  HiChevronRight,
  HiClock,
  HiEye
} from "react-icons/hi";

export default function EnhancedBlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [featuredBlog, setFeaturedBlog] = useState(null);

  // Demo data - replace with API call
  const demoBlogs = [
    {
      _id: "201",
      title: "Tech Corp Achieves 500% Growth in 2024",
      description: "Our incredible journey from startup to industry leader, celebrating milestones and team success.",
      content: "Full content here...",
      category: "growth",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
      companyName: "Tech Corp",
      companyLogo: "https://via.placeholder.com/100",
      author: "John Smith",
      createdAt: new Date().toISOString(),
      views: 1240,
      status: "published"
    },
    {
      _id: "202",
      title: "Annual Tech Summit 2024 - Key Highlights",
      description: "Recap of our biggest tech event with industry leaders, innovations, and networking opportunities.",
      content: "Full content here...",
      category: "event",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
      companyName: "Innovation Labs",
      companyLogo: "https://via.placeholder.com/100",
      author: "Sarah Johnson",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      views: 890,
      status: "published"
    },
    {
      _id: "203",
      title: "Building an Inclusive Workplace Culture",
      description: "How we're fostering diversity, equity, and inclusion across all levels of our organization.",
      content: "Full content here...",
      category: "culture",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
      companyName: "Global Solutions",
      companyLogo: "https://via.placeholder.com/100",
      author: "Mike Chen",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      views: 2100,
      status: "published"
    }
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await axios.get("/api/blogs");
      // setBlogs(response.data.blogs);
      
      // Using demo data for now
      setBlogs(demoBlogs);
      setFeaturedBlog(demoBlogs[0]);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs(demoBlogs);
      setFeaturedBlog(demoBlogs[0]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Stories", icon: <HiNewspaper /> },
    { value: "event", label: "Events", icon: <HiCalendar /> },
    { value: "achievement", label: "Achievements", icon: <HiStar /> },
    { value: "growth", label: "Growth", icon: <HiTrendingUp /> },
    { value: "culture", label: "Culture", icon: <HiUserGroup /> },
    { value: "news", label: "News", icon: <HiOfficeBuilding /> }
  ];

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <HiNewspaper className="text-6xl mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Company Stories</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Discover the latest updates, achievements, and insights from leading companies
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search stories, companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <HiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilterCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition ${
                  filterCategory === cat.value
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Blog */}
        {featuredBlog && filterCategory === "all" && !searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Story</h2>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition cursor-pointer"
                 onClick={() => navigate(`/blogs/${featuredBlog._id}`)}>
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getCategoryColor(featuredBlog.category)}`}>
                      {getCategoryIcon(featuredBlog.category)}
                      {featuredBlog.category}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <HiClock />
                      {formatDistanceToNow(new Date(featuredBlog.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition">
                    {featuredBlog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-lg">
                    {featuredBlog.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={featuredBlog.companyLogo}
                        alt={featuredBlog.companyName}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{featuredBlog.companyName}</p>
                        <p className="text-sm text-gray-500">{featuredBlog.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <HiEye />
                      <span className="text-sm">{featuredBlog.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {filterCategory === "all" ? "Latest Stories" : `${categories.find(c => c.value === filterCategory)?.label || "Stories"}`}
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading stories...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <HiNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No stories found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map(blog => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onClick={() => navigate(`/blogs/${blog._id}`)}
                  getCategoryColor={getCategoryColor}
                  getCategoryIcon={getCategoryIcon}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BlogCard({ blog, onClick, getCategoryColor, getCategoryIcon }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(blog.category)}`}>
            {getCategoryIcon(blog.category)}
            {blog.category}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <HiClock />
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {blog.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <img
              src={blog.companyLogo}
              alt={blog.companyName}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{blog.companyName}</p>
              <p className="text-xs text-gray-500">{blog.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <HiEye className="text-sm" />
            <span className="text-xs">{blog.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}