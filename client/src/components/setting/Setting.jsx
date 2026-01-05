import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FaCog, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaSave,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import { userApi } from "../../api/api";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    password: "",
    confirmPassword: ""
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: user.profileImage || "",
        password: "",
        confirmPassword: ""
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors on input
    if (error && name !== 'password' && name !== 'confirmPassword') {
      setError("");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      errors.phone = "Phone must be 10 digits";
    }

    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }

    setError(errors.name || errors.email || errors.phone || errors.password || errors.confirmPassword || "");
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        ...(formData.password && { password: formData.password })
      };

      // Update user profile
      const response = await userApi.put('/', updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update Redux store
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user
      });

      setSuccess("Profile updated successfully!");
      setEditing(false);
      
      // Auto-hide success message
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-6 shadow-2xl flex items-center justify-center">
            <FaCog className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-slate-700 bg-clip-text text-transparent mb-4">
            Account Settings
          </h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Manage your profile, update information, and secure your account
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-8 p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-2xl shadow-lg flex items-center gap-3 animate-pulse">
            <FaCheckCircle className="w-5 h-5" />
            {success}
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-800 rounded-2xl shadow-lg flex items-center gap-3">
            <FaTimesCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/50">
          {/* Profile Image */}
          <div className="p-8 lg:p-12 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative group">
                <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/50 bg-gradient-to-br from-blue-100 to-indigo-100">
                  <img 
                    src={formData.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=facearea&facepad=3"}
                    alt="Profile"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <label className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-2xl shadow-lg border-2 border-gray-200 cursor-pointer hover:shadow-xl transition-all hover:bg-blue-50 group-hover:-translate-y-1">
                  <FaCamera className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="text-center lg:text-left flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-blue-600 font-semibold mb-1">{formData.email}</p>
                <p className="text-gray-600">{formData.phone}</p>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-8">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="w-4 h-4 text-blue-600" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-lg placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4 text-blue-600" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-lg placeholder-gray-400"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaPhone className="w-4 h-4 text-blue-600" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-lg placeholder-gray-400"
                placeholder="1234567890"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaLock className="w-6 h-6 text-blue-600" />
                Change Password (Optional)
              </h3>
              
              {/* Current Password */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-5 py-4 pr-14 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-lg placeholder-gray-400"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-lg placeholder-gray-400"
                    placeholder="New password (min 6 chars)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-lg placeholder-gray-400"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold text-lg rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
