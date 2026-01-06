import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { blogApi } from '../../../api/api';
import { FaArrowLeft, FaEye, FaHeart, FaClock, FaBuilding, FaUser, FaShare, FaBookmark } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const BLOG_CATEGORIES = [
  { value: 'event', label: '🎉 Company Event', color: 'blue' },
  { value: 'achievement', label: '🏆 Achievement', color: 'yellow' },
  { value: 'growth', label: '📈 Company Growth', color: 'green' },
  { value: 'culture', label: '👥 Company Culture', color: 'purple' },
  { value: 'news', label: '📰 Industry News', color: 'red' }
];

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    fetchBlogDetails();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (blog) {
      fetchRelatedBlogs();
      checkIfLiked();
    }
  }, [blog]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await blogApi.get(`/${id}`);
      setBlog(response.data.blog);
      setLikesCount(response.data.blog.likes || 0);
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Blog not found');
      navigate('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await blogApi.get('/', {
        params: {
          category: blog.category,
          limit: 3
        }
      });
      // Filter out current blog
      const filtered = response.data.blogs.filter(b => b._id !== blog._id);
      setRelatedBlogs(filtered.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const checkIfLiked = () => {
    if (blog && user && blog.likedBy) {
      setIsLiked(blog.likedBy.includes(user._id));
    }
  };

  const handleLike = async () => {
    if (!token) {
      toast.info('Please login to like this blog');
      return;
    }

    try {
      const response = await blogApi.post(`/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsLiked(response.data.isLiked);
      setLikesCount(response.data.likes);
      toast.success(response.data.message);
    } catch (error) {
      console.error('Error liking blog:', error);
      toast.error('Failed to like blog');
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: url
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const getCategoryData = (category) => {
    return BLOG_CATEGORIES.find(c => c.value === category) || {};
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const categoryData = getCategoryData(blog.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Hero Image Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/blogs')}
          className="absolute top-8 left-8 px-6 py-3 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold hover:bg-white/30 transition flex items-center gap-2 shadow-lg"
        >
          <FaArrowLeft /> Back to Blogs
        </motion.button>

        {/* Blog Title Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-0 left-0 right-0 p-12 text-white"
        >
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className={`bg-${categoryData.color}-500 px-6 py-2 rounded-full text-sm font-semibold inline-block shadow-lg`}>
                {categoryData.label}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {blog.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <FaBuilding />
                <span className="font-semibold">{blog.companyId?.name || 'Company'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <FaUser />
                <span>{blog.authorId?.name || 'Author'}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <FaClock />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <FaEye />
                <span>{blog.views || 0} views</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-12 pb-8 border-b-2 border-gray-200"
        >
          <button
            onClick={handleLike}
            className={`px-8 py-4 rounded-xl font-semibold transition-all shadow-lg flex items-center gap-3 ${
              isLiked
                ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <FaHeart className={isLiked ? 'animate-pulse' : ''} />
            <span>{likesCount} Likes</span>
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleShare}
              className="p-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition shadow-lg"
              title="Share"
            >
              <FaShare className="text-xl" />
            </button>
            <button
              className="p-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition shadow-lg"
              title="Bookmark"
            >
              <FaBookmark className="text-xl" />
            </button>
          </div>
        </motion.div>

        {/* Blog Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="text-2xl text-gray-700 leading-relaxed font-medium italic border-l-4 border-blue-600 pl-6 py-4 bg-blue-50 rounded-r-xl">
            {blog.description}
          </p>
        </motion.div>

        {/* Blog Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="prose prose-lg max-w-none"
        >
          <div className="text-gray-800 leading-relaxed space-y-6 text-lg">
            {blog.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </motion.div>

        {/* Company Info Card */}
        {blog.companyId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-16 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              {blog.companyId.logo && (
                <img
                  src={blog.companyId.logo}
                  alt={blog.companyId.name}
                  className="w-16 h-16 rounded-xl object-cover bg-white p-2"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold">About {blog.companyId.name}</h3>
                <p className="text-blue-100">Learn more about this company</p>
              </div>
            </div>
            {blog.companyId.website && (
              <a
                href={blog.companyId.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg"
              >
                Visit Company Website →
              </a>
            )}
          </motion.div>
        )}

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-20"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id}
                  onClick={() => {
                    navigate(`/blogs/${relatedBlog._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedBlog.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <FaEye /> {relatedBlog.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-400" /> {relatedBlog.likes || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
