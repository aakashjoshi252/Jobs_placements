import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { blogApi, companyApi } from '../../../api/api';
import { 
  FaBlog, FaEdit, FaTrash, FaEye, FaHeart, FaPlus, FaChartLine, 
  FaFileAlt, FaCheckCircle, FaFileArchive, FaSearch, FaFilter,
  FaSortAmountDown, FaSortAmountUp 
} from 'react-icons/fa';
import { GiJewelCrown } from 'react-icons/gi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const BLOG_CATEGORIES = [
  { value: 'event', label: '🎉 Company Event', color: 'blue' },
  { value: 'achievement', label: '🏆 Achievement', color: 'yellow' },
  { value: 'growth', label: '📈 Company Growth', color: 'green' },
  { value: 'culture', label: '👥 Company Culture', color: 'purple' },
  { value: 'news', label: '📰 Industry News', color: 'red' }
];

export default function BlogManager() {
  const navigate = useNavigate();
  const loggedUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [companyId, setCompanyId] = useState(null);
  
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, published, draft
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostViewed, mostLiked

  // Fetch company ID
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await companyApi.get(`/recruiter/${loggedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const company = response.data.data || response.data;
        if (company?._id) {
          setCompanyId(company._id);
        }
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    };
    
    if (loggedUser?._id) {
      fetchCompany();
    }
  }, [loggedUser, token]);

  // Fetch blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await blogApi.get(`/company/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [companyId, token]);

  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      if (!companyId) {
        setStatsLoading(false);
        return;
      }
      
      try {
        setStatsLoading(true);
        const response = await blogApi.get(`/stats/${companyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching blog stats:', error);
        setStats({
          totalBlogs: 0,
          publishedBlogs: 0,
          draftBlogs: 0,
          totalViews: 0,
          totalLikes: 0,
          avgViews: 0,
          avgLikes: 0
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [companyId, token, blogs]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...blogs];

    // Search filter
    if (searchQuery) {
      result = result.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(blog => blog.status === statusFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(blog => blog.category === categoryFilter);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostViewed':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'mostLiked':
        result.sort((a, b) => (b.likes || 0) - (a.likes || 0));
        break;
      default:
        break;
    }

    setFilteredBlogs(result);
  }, [blogs, searchQuery, statusFilter, categoryFilter, sortBy]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    try {
      await blogApi.delete(`/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('✅ Blog deleted successfully!');
      setBlogs(blogs.filter(b => b._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('❌ Failed to delete blog');
    }
  };

  const getCategoryColor = (category) => {
    const cat = BLOG_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  const getCategoryLabel = (category) => {
    const cat = BLOG_CATEGORIES.find(c => c.value === category);
    return cat?.label || category;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md"
        >
          <GiJewelCrown className="text-8xl text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Company Registration Required</h2>
          <p className="text-gray-600 mb-8 text-lg">
            You need to register your company before you can create and manage blogs.
          </p>
          <button
            onClick={() => navigate('/recruiter/company/registration')}
            className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg text-lg"
          >
            Register Company Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 mb-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <FaBlog className="text-5xl" />
              <div>
                <h1 className="text-4xl font-bold">Blog Manager</h1>
                <p className="text-blue-100 text-lg">Create and manage your company's stories</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/recruiter/blogs/create')}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center gap-3 text-lg"
            >
              <FaPlus className="text-xl" />
              Create New Blog
            </button>
          </div>
        </motion.div>

        {/* Statistics Dashboard */}
        {!statsLoading && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8"
          >
            {/* Total Blogs */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaFileAlt className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{stats.totalBlogs}</div>
              <div className="text-sm opacity-90 font-semibold">Total Blogs</div>
            </div>

            {/* Published */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaCheckCircle className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{stats.publishedBlogs}</div>
              <div className="text-sm opacity-90 font-semibold">Published</div>
            </div>

            {/* Drafts */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaFileArchive className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{stats.draftBlogs}</div>
              <div className="text-sm opacity-90 font-semibold">Drafts</div>
            </div>

            {/* Total Views */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaEye className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{stats.totalViews}</div>
              <div className="text-sm opacity-90 font-semibold">Total Views</div>
            </div>

            {/* Total Likes */}
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaHeart className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{stats.totalLikes}</div>
              <div className="text-sm opacity-90 font-semibold">Total Likes</div>
            </div>

            {/* Avg Views */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaChartLine className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{Math.round(stats.avgViews)}</div>
              <div className="text-sm opacity-90 font-semibold">Avg Views</div>
            </div>

            {/* Avg Likes */}
            <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaHeart className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">{Math.round(stats.avgLikes)}</div>
              <div className="text-sm opacity-90 font-semibold">Avg Likes</div>
            </div>

            {/* Engagement */}
            <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition">
              <FaChartLine className="text-4xl mb-3 opacity-80" />
              <div className="text-4xl font-bold mb-1">
                {stats.totalViews > 0 ? Math.round((stats.totalLikes / stats.totalViews) * 100) : 0}%
              </div>
              <div className="text-sm opacity-90 font-semibold">Engagement</div>
            </div>
          </motion.div>
        )}

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <FaFilter className="text-blue-600 text-xl" />
            <h2 className="text-2xl font-bold text-gray-800">Filter & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-semibold"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-semibold"
            >
              <option value="all">All Categories</option>
              {BLOG_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition font-semibold"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostViewed">Most Viewed</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>

          {/* Active filters display */}
          {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 font-semibold">Active Filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  Search: {searchQuery}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  Status: {statusFilter}
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  Category: {getCategoryLabel(categoryFilter)}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold hover:bg-red-200 transition"
              >
                Clear All
              </button>
            </div>
          )}

          <div className="mt-4 text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredBlogs.length}</span> of{' '}
            <span className="font-bold text-gray-800">{blogs.length}</span> blogs
          </div>
        </motion.div>

        {/* Blogs Grid */}
        {filteredBlogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-16 text-center"
          >
            <FaBlog className="text-8xl text-gray-300 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {blogs.length === 0 ? 'No Blogs Yet' : 'No Matching Blogs'}
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              {blogs.length === 0
                ? "Start sharing your company's story by creating your first blog!"
                : 'Try adjusting your filters to see more results.'}
            </p>
            {blogs.length === 0 ? (
              <button
                onClick={() => navigate('/recruiter/blogs/create')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg text-lg"
              >
                Create Your First Blog
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg text-lg"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group"
                >
                  {/* Blog Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`bg-${getCategoryColor(blog.category)}-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg`}>
                        {getCategoryLabel(blog.category)}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg ${
                        blog.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {blog.status === 'published' ? '✓ Published' : '📝 Draft'}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white text-sm">
                      <span className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        <FaEye /> {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                        <FaHeart className="text-red-400" /> {blog.likes || 0}
                      </span>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                      <FaClock />
                      <span>{formatDate(blog.createdAt)}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/recruiter/blogs/edit/${blog._id}`)}
                        className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2 shadow-md"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold shadow-md"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
