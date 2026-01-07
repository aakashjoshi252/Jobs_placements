import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { blogApi } from "../../../api/api";
import { formatDistanceToNow } from "date-fns";
import {
  HiArrowLeft,
  HiHeart,
  HiOutlineHeart,
  HiEye,
  HiCalendar,
  HiOfficeBuilding,
  HiUser,
  HiShare,
  HiStar,
  HiTrendingUp,
  HiUserGroup,
  HiNewspaper
} from "react-icons/hi";

export default function BlogDetails() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await blogApi.get(`/${blogId}`);
      
      if (response.data.success) {
        const blogData = response.data.blog;
        setBlog(blogData);
        setLikeCount(blogData.likes || 0);
        setIsLiked(blogData.likedBy?.includes(user?._id));
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to load blog. Please try again.");
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this blog");
      navigate("/login");
      return;
    }

    try {
      setLiking(true);
      const response = await blogApi.post(`/${blogId}/like`);
      
      if (response.data.success) {
        setLikeCount(response.data.likes);
        setIsLiked(response.data.isLiked);
      }
    } catch (error) {
      console.error("Error liking blog:", error);
    } finally {
      setLiking(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("✅ Link copied to clipboard!");
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HiNewspaper className="text-7xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog Not Found</h2>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
          >
            Back to Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/blogs")}
              className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition"
            >
              <HiArrowLeft className="text-xl" />
              <span className="font-medium">Back to Blogs</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${
                  isLiked
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {isLiked ? <HiHeart className="text-xl" /> : <HiOutlineHeart className="text-xl" />}
                <span>{likeCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                <HiShare className="text-xl" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Meta Info */}
        <div className="flex items-center gap-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getCategoryColor(blog.category)}`}>
            {getCategoryIcon(blog.category)}
            {blog.category}
          </span>
          <span className="text-gray-500 flex items-center gap-2">
            <HiCalendar />
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </span>
          <span className="text-gray-500 flex items-center gap-2">
            <HiEye />
            {blog.views} views
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

        {/* Description */}
        <p className="text-xl text-gray-600 mb-8">{blog.description}</p>

        {/* Company Info */}
        {blog.companyId && (
          <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg border border-gray-200">
            {blog.companyId.uploadLogo && (
              <img
                src={blog.companyId.uploadLogo}
                alt={blog.companyId.companyName}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <HiOfficeBuilding />
                <span>Published by</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">{blog.companyId.companyName}</h3>
              {blog.companyId.location && (
                <p className="text-sm text-gray-600">{blog.companyId.location}</p>
              )}
            </div>
          </div>
        )}

        {/* Cover Image */}
        {blog.image && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
              }}
            />
          </div>
        )}

        {/* Blog Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {blog.content}
            </div>
          </div>
        </div>

        {/* Author Info */}
        {blog.authorId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <HiUser />
              About the Author
            </h3>
            <div className="flex items-center gap-4">
              {blog.authorId.profilePicture && (
                <img
                  src={blog.authorId.profilePicture}
                  alt={blog.authorId.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h4 className="font-semibold text-gray-900">{blog.authorId.username}</h4>
                {blog.authorId.bio && (
                  <p className="text-sm text-gray-600 mt-1">{blog.authorId.bio}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-xl shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Enjoyed this story?</h3>
          <p className="text-emerald-100 mb-6">Discover more insights from amazing companies</p>
          <button
            onClick={() => navigate("/blogs")}
            className="px-8 py-3 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition font-semibold shadow-lg"
          >
            Explore More Blogs
          </button>
        </div>
      </div>
    </div>
  );
}
