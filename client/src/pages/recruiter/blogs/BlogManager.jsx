import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaBlog, FaEdit, FaTrash, FaEye, FaHeart, FaPlus, FaImage, FaSave } from 'react-icons/fa';
import { GiJewelCrown } from 'react-icons/gi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BLOG_CATEGORIES = [
  { value: 'event', label: '🎉 Company Event', color: 'blue' },
  { value: 'achievement', label: '🏆 Achievement', color: 'yellow' },
  { value: 'growth', label: '📈 Company Growth', color: 'green' },
  { value: 'culture', label: '👥 Company Culture', color: 'purple' },
  { value: 'news', label: '📰 Industry News', color: 'red' }
];

export default function BlogManager() {
  const loggedUser = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const [companyId, setCompanyId] = useState(null);
  
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'news',
    image: '',
    status: 'draft'
  });

  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch company ID
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/company/recruiter/${loggedUser._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompanyId(response.data._id);
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
      if (!companyId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/api/blogs/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [companyId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitLoading(true);
    
    try {
      const blogData = {
        ...formData,
        companyId
      };

      if (editingBlog) {
        // Update existing blog
        await axios.put(
          `${API_URL}/api/blogs/${editingBlog._id}`,
          blogData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('✅ Blog updated successfully!');
      } else {
        // Create new blog
        await axios.post(
          `${API_URL}/api/blogs`,
          blogData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('✅ Blog created successfully!');
      }

      // Refresh blogs list
      const response = await axios.get(
        `${API_URL}/api/blogs/company/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBlogs(response.data.blogs || []);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert('❌ Error saving blog: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      content: blog.content,
      category: blog.category,
      image: blog.image,
      status: blog.status
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/blogs/${blogId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Blog deleted successfully!');
      setBlogs(blogs.filter(b => b._id !== blogId));
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('❌ Error deleting blog');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'news',
      image: '',
      status: 'draft'
    });
    setEditingBlog(null);
    setShowForm(false);
    setErrors({});
  };

  const getCategoryColor = (category) => {
    const cat = BLOG_CATEGORIES.find(c => c.value === category);
    return cat?.color || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBlog className="text-4xl text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Company Blogs</h1>
                <p className="text-gray-600">Share your company's stories and achievements</p>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg flex items-center gap-2"
            >
              <FaPlus />
              {showForm ? 'Cancel' : 'Create New Blog'}
            </button>
          </div>
        </div>

        {/* Blog Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <GiJewelCrown className="text-blue-600" />
              {editingBlog ? 'Edit Blog' : 'Create New Blog'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Our Latest Jewelry Collection Launch"
                  maxLength={200}
                />
                <div className="flex justify-between mt-1">
                  {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.title.length}/200 characters
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief summary of your blog post (shown in preview cards)"
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  <p className="text-gray-500 text-xs ml-auto">
                    {formData.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {BLOG_CATEGORIES.map((cat) => (
                    <label
                      key={cat.value}
                      className={`cursor-pointer p-4 rounded-lg border-2 transition ${
                        formData.category === cat.value
                          ? `border-${cat.color}-500 bg-${cat.color}-50`
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formData.category === cat.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-sm">{cat.label}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <FaImage className="inline mr-1" />
                  Cover Image URL (optional)
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg (Leave empty for default)"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Tip: Upload to Imgur or use Unsplash image URL
                </p>
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="12"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm ${
                    errors.content ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Write your blog content here. You can use line breaks for paragraphs.

Example:

We are excited to announce the launch of our new jewelry collection...

Our team has worked tirelessly..."
                />
                {errors.content && <p className="text-red-500 text-sm mt-2">{errors.content}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Publication Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Save as Draft</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700">Publish Now</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FaSave />
                  {submitLoading ? 'Saving...' : (editingBlog ? 'Update Blog' : 'Create Blog')}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blogs List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Published Blogs ({blogs.length})</h2>

          {blogs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FaBlog className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No blogs yet</h3>
              <p className="text-gray-600 mb-4">Start sharing your company's story!</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Your First Blog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
                >
                  {/* Blog Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`bg-${getCategoryColor(blog.category)}-500 text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                        {BLOG_CATEGORIES.find(c => c.value === blog.category)?.label}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className={`text-white text-xs px-3 py-1 rounded-full font-semibold ${
                        blog.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {blog.status === 'published' ? '✓ Published' : '📝 Draft'}
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

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <FaEye /> {blog.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaHeart className="text-red-500" /> {blog.likes || 0}
                      </span>
                      <span className="text-xs">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
