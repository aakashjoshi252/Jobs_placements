import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { blogApi, companyApi } from "../../../api/api";
import { toast } from "react-toastify";
import {
  HiArrowLeft,
  HiSave,
  HiEye,
  HiPhotograph,
  HiNewspaper,
  HiCalendar,
  HiStar,
  HiTrendingUp,
  HiUserGroup,
  HiOfficeBuilding,
  HiExclamationCircle
} from "react-icons/hi";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [companyId, setCompanyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "news",
    image: "",
    status: "draft"
  });

  const categories = [
    { value: "event", label: "Event", icon: <HiCalendar />, desc: "Company events, conferences, meetups" },
    { value: "achievement", label: "Achievement", icon: <HiStar />, desc: "Awards, milestones, recognitions" },
    { value: "growth", label: "Growth Story", icon: <HiTrendingUp />, desc: "Company expansion, new markets" },
    { value: "culture", label: "Company Culture", icon: <HiUserGroup />, desc: "Team activities, work environment" },
    { value: "news", label: "Company News", icon: <HiOfficeBuilding />, desc: "General updates, announcements" }
  ];

  // Fetch company ID on mount
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setCompanyLoading(true);
        const response = await companyApi.get(`/recruiter/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const company = response.data.data || response.data;
        if (company?._id) {
          setCompanyId(company._id);
        } else {
          toast.error('Company not found. Please register your company first.');
          navigate('/recruiter/company/registration');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        toast.error('Failed to load company information');
        navigate('/recruiter/company/registration');
      } finally {
        setCompanyLoading(false);
      }
    };

    if (user?._id) {
      fetchCompany();
    }
  }, [user, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Comprehensive validation function
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 10) {
      newErrors.title = 'Title must be at least 10 characters long';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title cannot exceed 200 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters long';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description cannot exceed 200 characters';
    }

    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 100) {
      newErrors.content = 'Content must be at least 100 characters long for a meaningful blog post';
    } else if (formData.content.length > 10000) {
      newErrors.content = 'Content cannot exceed 10,000 characters';
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    // Image URL validation (optional but if provided, must be valid)
    if (formData.image) {
      try {
        const url = new URL(formData.image);
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.image = 'Image URL must use HTTP or HTTPS protocol';
        }
        // Check if URL looks like an image
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const hasImageExtension = imageExtensions.some(ext => 
          formData.image.toLowerCase().includes(ext)
        );
        if (!hasImageExtension && !formData.image.includes('unsplash') && !formData.image.includes('imgur')) {
          newErrors.image = 'URL should point to an image file';
        }
      } catch (e) {
        newErrors.image = 'Please enter a valid image URL';
      }
    }

    // Company ID validation
    if (!companyId) {
      newErrors.general = 'Company information is missing. Please try again.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix all validation errors before submitting');
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    if (!companyId) {
      toast.error('Company information is missing. Please refresh and try again.');
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        status,
        companyId,
        // Trim all text fields
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim()
      };

      console.log('Submitting blog data:', dataToSubmit);

      const response = await blogApi.post('/', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Blog created successfully:', response.data);

      toast.success(
        `✅ Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully!`,
        { autoClose: 3000 }
      );

      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate("/recruiter/blogs");
      }, 1000);
    } catch (error) {
      console.error("Error creating blog:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create blog. Please try again.';
      
      toast.error(`❌ ${errorMessage}`);
      
      // If there are validation errors from backend, display them
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching company
  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/recruiter/blogs")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                disabled={loading}
              >
                <HiArrowLeft className="text-2xl text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <HiNewspaper className="text-2xl text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
                  <p className="text-sm text-gray-600">Share your company's story</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={loading}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiSave />
                {loading ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiEye />
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* General Error Alert */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <HiExclamationCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error</h3>
              <p className="text-sm text-red-800">{errors.general}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., We've Reached 1000 Employees Milestone!"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg transition ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
              }`}
              maxLength={200}
              required
            />
            <div className="flex justify-between items-center mt-1">
              {errors.title ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <HiExclamationCircle /> {errors.title}
                </p>
              ) : (
                <p className="text-xs text-gray-500">At least 10 characters</p>
              )}
              <p className="text-xs text-gray-500">{formData.title.length}/200</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of your blog post (will be shown in preview)"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition resize-none ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
              }`}
              rows={3}
              maxLength={200}
              required
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <HiExclamationCircle /> {errors.description}
                </p>
              ) : (
                <p className="text-xs text-gray-500">At least 20 characters</p>
              )}
              <p className="text-xs text-gray-500">{formData.description.length}/200</p>
            </div>
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: cat.value }));
                    if (errors.category) {
                      setErrors(prev => ({ ...prev, category: '' }));
                    }
                  }}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    formData.category === cat.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl text-emerald-600">{cat.icon}</span>
                    <span className="font-semibold text-gray-900">{cat.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{cat.desc}</p>
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                <HiExclamationCircle /> {errors.category}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL (Optional)
            </label>
            <div className="relative">
              <HiPhotograph className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg or https://images.unsplash.com/..."
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition ${
                  errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                }`}
              />
            </div>
            {errors.image && (
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <HiExclamationCircle /> {errors.image}
              </p>
            )}
            {formData.image && !errors.image && (
              <div className="mt-3">
                <p className="text-xs text-gray-600 mb-2">Image Preview:</p>
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
                    setErrors(prev => ({ ...prev, image: 'Failed to load image. Please check the URL.' }));
                  }}
                />
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Use high-quality images from Unsplash or upload to Imgur
            </p>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog content here...\n\nShare the story, include details, and make it engaging!\n\nYou can use line breaks to separate paragraphs."
              rows={15}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none font-mono text-sm transition ${
                errors.content ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
              }`}
              maxLength={10000}
              required
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content ? (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <HiExclamationCircle /> {errors.content}
                </p>
              ) : (
                <p className="text-xs text-gray-500">At least 100 characters for a meaningful post</p>
              )}
              <p className="text-xs text-gray-500">{formData.content.length}/10,000</p>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <HiNewspaper />
              Tips for a Great Blog Post
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Use a catchy, descriptive title (10-200 characters)</li>
              <li>✓ Write a compelling description (20-200 characters)</li>
              <li>✓ Add a high-quality cover image (optional)</li>
              <li>✓ Write substantial content (minimum 100 characters)</li>
              <li>✓ Structure your content with clear paragraphs</li>
              <li>✓ Include specific details and examples</li>
              <li>✓ Proofread before publishing</li>
              <li>✓ Save as draft first to review later</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
