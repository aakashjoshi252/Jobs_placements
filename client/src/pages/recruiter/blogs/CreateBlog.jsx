import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {blogApi} from "../../../api/api"
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
  HiUpload,
  HiX,
  HiCheckCircle
} from "react-icons/hi";

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const company = useSelector((state) => state.company.data);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "news",
    image: "",
    status: "draft",
    companyId: company?._id || "",
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

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      const formDataToUpload = new FormData();
      formDataToUpload.append('image', selectedFile);

      const response = await blogApi.post('/upload-image', formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (response.data.success) {
        setFormData(prev => ({ ...prev, image: response.data.imageUrl }));
        alert('✅ Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const handleSubmit = async (status) => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Upload image if selected but not uploaded yet
    if (selectedFile && !formData.image) {
      await handleImageUpload();
    }

    try {
      setLoading(true);
      const dataToSubmit = { ...formData, status };
      
      await blogApi.post(`/`, dataToSubmit);
      
      alert(`✅ Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
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
                disabled={loading || uploading}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiSave />
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={loading || uploading}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Image Upload Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Image
            </label>
            
            {/* Upload Area */}
            {!previewUrl && !formData.image && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition">
                <HiPhotograph className="mx-auto text-5xl text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Upload a cover image for your blog</p>
                <p className="text-sm text-gray-500 mb-4">JPEG, PNG, WebP, or GIF • Max 10MB</p>
                <label className="inline-block px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition cursor-pointer">
                  <HiUpload className="inline mr-2" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Preview and Upload Button */}
            {(previewUrl || formData.image) && (
              <div className="space-y-3">
                <div className="relative group">
                  <img
                    src={formData.image || previewUrl}
                    alt="Blog cover preview"
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
                    }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>

                {/* Upload button if file selected but not uploaded */}
                {selectedFile && !formData.image && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleImageUpload}
                      disabled={uploading}
                      className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Uploading... {uploadProgress}%
                        </>
                      ) : (
                        <>
                          <HiUpload />
                          Upload to Cloudinary
                        </>
                      )}
                    </button>
                    <label className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer">
                      Change
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}

                {/* Upload progress bar */}
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}

                {/* Success message */}
                {formData.image && !selectedFile && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                    <HiCheckCircle className="text-xl" />
                    <span className="text-sm font-medium">Image uploaded successfully</span>
                  </div>
                )}
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
              <li>• Add a high-quality cover image (uploads to Cloudinary)</li>
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