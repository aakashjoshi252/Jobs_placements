import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { companyApi } from "../../../../../api/api";
import { useNavigate } from "react-router-dom";

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

  /** Handle text inputs */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** Handle logo upload */
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogo(file);
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
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

  try {
    const data = new FormData();

    // Text fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Logo (optional)
    if (logo) {
      data.append("uploadLogo", logo); // ⚠️ field name must match backend
    }

    // Required fields
    data.append("recruiterId", user._id);

    await companyApi.put(
      `/update/${company._id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    setSuccess("Company details updated successfully!");

    setTimeout(() => {
      navigate(`/recruiter/company/${company._id}`);
    }, 1000);

  } catch (err) {
    console.error(err);
    setError("Failed to update company details.");
  } finally {
    setLoading(false);
  }
};

  if (!company) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Company data not found.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">

      {/* Back button */}
      <button
        onClick={() => navigate(`/recruiter/company/${company._id}`)}
        className="mb-6 text-blue-600 underline hover:text-blue-800"
      >
        ← Back to Company View
      </button>

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Edit Company Information
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border"
      >
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          {preview && (
            <img
              src={preview}
              alt="Logo Preview"
              className="w-28 h-28 object-contain border rounded-xl mb-4"
            />
          )}

          <label className="text-sm font-semibold text-gray-700">
            Upload Logo
          </label>
          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
            <InputField label="Industry" name="industry" value={formData.industry} onChange={handleChange} />
            <InputField label="Company Size" name="size" value={formData.size} onChange={handleChange} />
            <InputField label="Established Year" name="establishedYear" value={formData.establishedYear} onChange={handleChange} />
            <InputField label="Contact Email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} />
          </div>

          <div className="space-y-4">
            <InputField label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />
            <InputField label="Website" name="website" value={formData.website} onChange={handleChange} />

            <div>
              <label className="font-semibold text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

/** Reusable Input Component */
const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="font-semibold text-gray-700">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
    />
  </div>
);
