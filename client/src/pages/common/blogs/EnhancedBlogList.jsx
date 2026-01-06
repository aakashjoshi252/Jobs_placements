import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../../api/api';
import { FaSearch, FaFilter, FaEye, FaHeart, FaClock, FaBuilding, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const BLOG_CATEGORIES = [
  { value: 'all', label: 'All Categories', icon: '🎯', color: 'gray' },
  { value: 'event', label: 'Company Events', icon: '🎉', color: 'blue' },
  { value: 'achievement', label: 'Achievements', icon: '🏆', color: 'yellow' },
  { value: 'growth', label: 'Company Growth', icon: '📈', color: 'green' },
  { value: 'culture', label: 'Company Culture', icon: '👥', color: 'purple' },
  { value: 'news', label: 'Industry News', icon: '📰', color: 'red' }
];

export default function EnhancedBlogList() {
  const navigate = useNavigate();
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await blogApi.get('/', { params });
      setBlogs(response.data.blogs || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const getCategoryColor = (category) => {
    const cat = BLOG_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  const getCategoryIcon = (category) => {
    const cat = BLOG_CATEGORIES.find(c => c.value === category);
    return cat?.icon || '📝';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Company Insights & Stories
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover the latest news, achievements, and culture from top companies
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search blogs by title or keywords..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-800 text-lg shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30 transition"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              Filter by Category
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {BLOG_CATEGORIES.map((category) => (
                <motion.button
                  key={category.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category.value)}
                  className={`p-4 rounded-xl font-semibold transition-all shadow-md ${
                    selectedCategory === category.value
                      ? `bg-${category.color}-500 text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm">{category.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600">
          {pagination && (
            <p className="text-lg">
              Showing <span className="font-semibold text-gray-800">{blogs.length}</span> of{' '}
              <span className="font-semibold text-gray-800">{pagination.total}</span> blogs
              {selectedCategory !== 'all' && (
                <span>
                  {' '}in{' '}
                  <span className="font-semibold text-blue-600">
                    {BLOG_CATEGORIES.find(c => c.value === selectedCategory)?.label}
                  </span>
                </span>
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No Blogs Found</h3>
            <p className="text-xl text-gray-600 mb-8">
              {searchQuery
                ? `No results for "${searchQuery}". Try different keywords.`
                : 'No blogs available in this category yet.'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* Blog Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleBlogClick(blog._id)}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                  >
                    {/* Blog Image */}
                    <div className="relative h-64 overflow-hidden">
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
                        <span className={`bg-${getCategoryColor(blog.category)}-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center gap-2`}>
                          <span>{getCategoryIcon(blog.category)}</span>
                          <span>{BLOG_CATEGORIES.find(c => c.value === blog.category)?.label.replace('Company ', '').replace('Industry ', '')}</span>
                        </span>
                      </div>

                      {/* Stats Overlay */}
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                            <FaEye /> {blog.views || 0}
                          </span>
                          <span className="flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
                            <FaHeart className="text-red-400" /> {blog.likes || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Blog Content */}
                    <div className="p-6">
                      {/* Company Info */}
                      <div className="flex items-center gap-2 mb-3">
                        <FaBuilding className="text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">
                          {blog.companyId?.name || 'Company'}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <FaClock className="text-xs" />
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                        {blog.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {blog.description}
                      </p>

                      {/* Read More Button */}
                      <button className="text-blue-600 font-semibold hover:text-blue-700 transition flex items-center gap-2 group/btn">
                        Read Full Story
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white text-gray-700 font-semibold hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <FaChevronLeft />
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === pagination.pages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[3rem] px-4 py-3 rounded-xl font-semibold transition shadow-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white scale-110'
                              : 'bg-white text-gray-700 hover:bg-blue-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-gray-400 px-2">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                  disabled={currentPage === pagination.pages}
                  className="p-3 rounded-xl bg-white text-gray-700 font-semibold hover:bg-blue-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
