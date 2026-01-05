import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaShareAlt } from "react-icons/fa";

import { 
  FaArrowLeft, 
  FaEye, 
  FaHeart, 
  FaClock,
  FaTag 
} from "react-icons/fa6";
import { blogApi } from "../../../api/api";

export default function BlogDetails() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch blog data
  useEffect(() => {
    if (!blogId) {
      setError("No blog ID provided");
      setLoading(false);
      return;
    }
    
    const handleFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await blogApi.get(`/${blogId}`);
        const data = res.data.blog || res.data;
        
        console.log("Blog data:", data);
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleFetch();
  }, [blogId]);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-lg text-gray-600 font-medium">Loading blog details...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
        <div className="max-w-2xl mx-auto">
          <button 
            className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft />
            Go Back
          </button>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaTag className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Blog Not Found"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              The blog you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Go Back
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Main blog content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button 
          className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-all group"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to blogs
        </button>

        <article className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/50">
          {/* Hero Image */}
          <div className="relative h-80 lg:h-96 overflow-hidden">
            <img 
              src={blog.image || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&fit=crop"} 
              alt={blog.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&fit=crop";
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Meta Info */}
          <div className="p-8 lg:p-12">
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
              {/* Category Badge */}
              {blog.category && (
                <span className={`px-4 py-2 rounded-full font-semibold text-xs uppercase tracking-wide shadow-md ${
                  blog.category === 'event' ? 'bg-blue-100 text-blue-800' :
                  blog.category === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                  blog.category === 'growth' ? 'bg-green-100 text-green-800' :
                  blog.category === 'culture' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  <FaTag className="inline mr-1 -mt-0.5" />
                  {blog.category}
                </span>
              )}
              
              {/* Status Badge */}
              {blog.status && (
                <span className={`px-4 py-2 rounded-full font-semibold text-xs shadow-md ${
                  blog.status === 'published' 
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                } border`}>
                  {blog.status.toUpperCase()}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Description */}
            {blog.description && (
              <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
                {blog.description}
              </p>
            )}

            {/* Date & Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-12 text-lg text-gray-500">
              <span className="flex items-center gap-2">
                <FaClock className="text-blue-500" />
                {new Date(blog.createdAt || blog.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 lg:px-12 pb-12 prose prose-lg max-w-none">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-200">
              <div className="prose prose-headings:text-gray-900 prose-headings:font-bold prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-700">
                {typeof blog.content === 'string' 
                  ? <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  : JSON.stringify(blog.content)
                }
              </div>
            </div>
          </div>

          {/* Stats & Actions */}
          <div className="px-8 lg:px-12 pb-8 pt-4 border-t border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Stats */}
              <div className="flex items-center gap-8 text-2xl lg:text-xl font-semibold text-gray-600">
                <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg">
                  <FaEye className="text-blue-500" />
                  {blog.views || 0} views
                </span>
                <span className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm shadow-lg">
                  <FaHeart className="text-red-500" />
                  {blog.likes || 0} likes
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5">
                  <FaHeart />
                  Like
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300">
                  <FaShareAlt />
                  Share
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
