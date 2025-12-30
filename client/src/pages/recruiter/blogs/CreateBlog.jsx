import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
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
  HiOfficeBuilding
} from "react-icons/hi";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "news",
    image: "",
    status: "draft",
    companyId: user?.companyId || "",
    authorId: user?._id || ""
  });

  const categories = [
    { value: "event", label: "Event", icon: <HiCalendar />, desc: "Company events, conferences, meetups" },
    { value: "achievement", label: "Achievement", icon: <HiStar />, desc: "Awards, milestones, recognitions" },
    { value: "growth", label: "Growth Story", icon: <HiTrendingUp />, desc: "Company expansion, new markets" },
    { value: "culture", label: "Company Culture", icon: <HiUserGroup />, desc: "Team activities, work environment" },
    { value: "news", label: "Company News", icon: <HiOfficeBuilding />, desc: "General updates, announcements" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (status) => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = { ...formData, status };
      
      // Replace with your actual API endpoint
      await axios.post("/api/blogs", dataToSubmit);
      
      alert(`Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      navigate("/recruiter/blogs");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/recruiter/blogs")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
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
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <HiSave />
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <HiEye />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief summary of your blog post (will be shown in preview)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              maxLength={200}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.description.length}/200 characters</p>
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
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
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
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL
            </label>
            <div className="relative">
              <HiPhotograph className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            {formData.image && (
              <div className="mt-3">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
                  }}
                />
              </div>
            )}
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
              placeholder="Write your blog content here... Share the story, include details, and make it engaging!"
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <HiNewspaper />
              Tips for a Great Blog Post
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use a catchy, descriptive title</li>
              <li>• Keep your description concise and engaging</li>
              <li>• Add a high-quality cover image</li>
              <li>• Structure your content with clear sections</li>
              <li>• Include specific details and examples</li>
              <li>• Proofread before publishing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}