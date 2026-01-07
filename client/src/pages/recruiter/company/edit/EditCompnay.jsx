import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { companyApi } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiUpload,
  HiX,
  HiCheckCircle,
  HiOfficeBuilding,
  HiPhotograph
} from "react-icons/hi";

export default function CompanyEdit() {
  const navigate = useNavigate();
  const company = useSelector((state) => state.company.data);
  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    companyName: company?.companyName || "",
    industry: company?.industry || "",
    size: company?.size || "",
    establishedYear: company?.establishedYear || "",
    contactEmail: company?.contactEmail || "",
    contactNumber: company?.contactNumber || "",
    location: company?.location || "",
    website: company?.website || "",
    description: company?.description || "",
  });

  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(company?.uploadLogo || null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  /** Handle text inputs */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** Handle logo upload with validation */
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setLogo(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  /** Remove logo */
  const handleRemoveLogo = () => {
    setLogo(null);
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(company?.uploadLogo || null);
  };

  /** Cleanup preview URL */
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /** Submit form */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setUploadProgress(0);

    try {
      const data = new FormData();

      // Text fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Logo (optional)
      if (logo) {
        data.append("uploadLogo", logo);
      }

      // Required fields
      data.append("recruiterId", user._id);

      const response = await companyApi.put(
        `/update/${company._id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      setSuccess("✅ Company profile updated successfully!");

      setTimeout(() => {
        navigate(`/recruiter/company/${company._id}`);
      }, 1500);

    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update company profile. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HiOfficeBuilding className="text-7xl text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Company data not found.</p>
          <button
            onClick={() => navigate("/recruiter/home")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/recruiter/company/${company._id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <HiArrowLeft className="text-2xl text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Company Profile</h1>
              <p className="text-sm text-gray-600">Update your company information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Alerts */}
          {success && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <HiCheckCircle className="text-2xl text-green-600" />
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          )}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <HiX className="text-2xl text-red-600" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Logo Upload Section */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Logo</h3>
            
            {preview ? (
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={preview}
                    alt="Logo Preview"
                    className="w-40 h-40 object-contain border-2 border-gray-200 rounded-xl bg-gray-50 p-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <HiX className="text-xl" />
                  </button>
                </div>
                <label className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium flex items-center gap-2">
                  <HiUpload />
                  Change Logo
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition">
                <HiPhotograph className="mx-auto text-6xl text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">Upload your company logo</p>
                <label className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer font-medium">
                  <HiUpload />
                  Choose Image
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-3">JPEG, PNG, WebP, or GIF (Max 5MB)</p>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
              <InputField
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Technology, Healthcare"
              />
              <InputField
                label="Company Size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="e.g., 50-200, 500+"
              />
              <InputField
                label="Established Year"
                name="establishedYear"
                value={formData.establishedYear}
                onChange={handleChange}
                type="number"
                placeholder="e.g., 2020"
              />
              <InputField
                label="Contact Email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                type="email"
                placeholder="contact@company.com"
              />
              <InputField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                type="tel"
                placeholder="+91 1234567890"
              />
              <InputField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
              <InputField
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                type="url"
                placeholder="https://www.company.com"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us about your company, its mission, and what makes it unique..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-8 bg-gray-50 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {uploadProgress > 0 && uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                </>
              ) : (
                <>
                  <HiCheckCircle className="text-2xl" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Reusable Input Component */
const InputField = ({ label, name, value, onChange, type = "text", placeholder = "", required = false }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    />
  </div>
);
