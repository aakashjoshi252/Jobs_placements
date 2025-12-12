import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CompanyView(){
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [error] = useState("");

  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.data);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
        About Your Company
      </h2>

      {/* Loading / Error */}
      {loading ? (
        <p className="text-center text-lg text-gray-700">Loading company details...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-medium">{error}</p>
      ) : company ? (
        <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 transition-transform hover:scale-[1.02] duration-300">

          {/* Logo + Name + Edit Button */}
          <div className="mb-8 flex flex-col md:flex-row items-center md:items-center md:justify-between bg-gray-50 p-4 rounded-xl shadow-sm gap-6">

            {/* Logo */}
            {company.uploadLogo && (
              <img
                src={
                  company.uploadLogo.startsWith("http")
                    ? company.uploadLogo
                    : `/uploads/${company.uploadLogo}`
                }
                alt="Company Logo"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain border-2 rounded-xl shadow-sm"
              />
            )}

            {/* Company Name */}
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800 text-center md:text-left flex-1">
              {company.companyName}
            </h3>

            {/* Edit Button */}
            <button
              onClick={() => navigate(`/recruiter/company/edit/${company._id}`)}
              className="px-5 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
            >
              Edit
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-700">

            {/* Left */}
            <div className="space-y-3">
              <DetailField label="Industry" value={company.industry} />
              <DetailField label="Company Size" value={company.size} />
              <DetailField label="Established Year" value={company.establishedYear} />
              <DetailField label="Email" value={company.contactEmail} />
              <DetailField label="Contact Number" value={company.contactNumber} />
            </div>

            {/* Right */}
            <div className="space-y-3">
              <DetailField label="Location" value={company.location} />

              {/* Website */}
              <p>
                <span className="font-semibold text-gray-900">Website:</span>{" "}
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 break-all"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span className="text-gray-600">Not Provided</span>
                )}
              </p>

              <DetailField label="Recruiter Email" value={user?.email} />

              {/* Description */}
              <div>
                <span className="font-semibold text-gray-900">Description:</span>
                <p className="text-gray-600 mt-1">
                  {company.description || "No description added."}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-8 text-gray-500 text-sm">
            © {new Date().getFullYear()} {company.companyName}. All rights reserved.
          </p>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No company details found.</p>
      )}
    </div>
  );
};

/* Reusable Field Component */
const DetailField = ({ label, value }) => (
  <p>
    <span className="font-semibold text-gray-900">{label}:</span>{" "}
    <span className="text-gray-600">{value || "Not Provided"}</span>
  </p>
);

const EditCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.data);
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
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Update Company
      await companyApi.updateCompany({
        ...formData,
        recruiterId: user?._id,
      });
      navigate("/recruiter/company");
    }
    catch (err) {
      setError(err.response?.data?.message || "Failed to update company details.");
    }
    setLoading(false);
  };
  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 text-center">
        Edit Company Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-lg border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10">
        {/* Company Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="companyName">
            Company Name
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Industry */}
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="industry">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Size */}
        <div>
          <label className="block text-gray-700 font-medium mb-2" htmlFor="size">
            Company Size
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Company"}
          </button>
        </div>
      </form>
    </div>
  );
};