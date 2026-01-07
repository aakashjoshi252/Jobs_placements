import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { blogApi } from "../../../api/api";
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

export default function EditBlog() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const company = useSelector((state) => state.company.data);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    status: "draft"
  });

  const categories = [
    { value: "event", label: "Event", icon: <HiCalendar />, desc: "Company events, conferences, meetups" },
    { value: "achievement", label: "Achievement", icon: <HiStar />, desc: "Awards, milestones, recognitions" },
    { value: "growth", label: "Growth Story", icon: <HiTrendingUp />, desc: "Company expansion, new markets" },
    { value: "culture", label: "Company Culture", icon: <HiUserGroup />, desc: "Team activities, work environment" },
    { value: "news", label: "Company News", icon: <HiOfficeBuilding />, desc: "General updates, announcements" }
  ];

  useEffect(() => {
    fetchBlogData();
  }, [blogId]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await blogApi.get(`/${blogId}`);
      
      if (response.data.success) {
        const blog = response.data.blog;
        setFormData({
          title: blog.title,
          description: blog.description,
          content: blog.content,
          category: blog.category,
          image: blog.image,
          status: blog.status
        });
        setPreviewUrl(blog.image);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to load blog. Please try again.");
      navigate("/recruiter/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        setSelectedFile(null);
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

    if (selectedFile && !formData.image) {
      await handleImageUpload();
    }

    try {
      setSaving(true);
      const dataToSubmit = { ...formData, status };
      
      await blogApi.put(`/${blogId}`, dataToSubmit);
      
      alert(`✅ Blog ${status === 'published' ? 'published' : 'updated'} successfully!`);
      navigate("/recruiter/blogs");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Failed to update blog. Please try again.");
    } finally {
      setSaving(false);
    }
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
                  <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                  <p className="text-sm text-gray-600">Update your company's story</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit('draft')}
                disabled={saving || uploading}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiSave />
                Save Draft
              </button>
              <button
                onClick={() => handleSubmit('published')}
                disabled={saving || uploading}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiEye />
                {formData.status === 'published' ? 'Update' : 'Publish'}
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
              placeholder="Brief summary of your blog post"
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

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Cover Image
            </label>
            
            {!previewUrl && !formData.image ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition">
                <HiPhotograph className="mx-auto text-5xl text-gray-400 mb-3" />
                <p className="text-gray-600 mb-2">Upload a cover image</p>
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
            ) : (
              <div className="space-y-3">
                <div className="relative group">
                  <img
                    src={formData.image || previewUrl}
                    alt="Blog cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>

                {selectedFile && !formData.image && (
                  <button
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
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
              placeholder="Write your blog content here..."
              rows={15}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">{formData.content.length} characters</p>
          </div>
        </div>
      </div>
    </div>
  );
}
