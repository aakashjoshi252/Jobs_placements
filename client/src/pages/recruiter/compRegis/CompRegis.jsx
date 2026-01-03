import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { companyApi } from "../../../api/api";
import { GiJewelCrown, GiDiamondRing, GiFactory } from "react-icons/gi";

const companyInitialValues = {
  uploadLogo: null,
  companyName: "",
  
  // JEWELRY SPECIFIC
  industry: "Jewelry & Gems",
  companyType: "",
  specializations: [],
  certifications: [],
  workshopFacilities: [],
  branches: [],
  socialMedia: {
    instagram: "",
    facebook: "",
    pinterest: "",
    youtube: ""
  },
  
  // GENERAL
  size: "",
  establishedYear: "",
  website: "",
  location: "",
  description: "",
  contactEmail: "",
  contactNumber: "",
};

// Jewelry constants
const COMPANY_TYPES = [
  "Jewelry Manufacturer",
  "Jewelry Retailer",
  "Jewelry Wholesaler",
  "Jewelry Designer Studio",
  "Gemstone Dealer",
  "Diamond Trading",
  "Jewelry Export House",
  "CAD/CAM Service Provider",
  "Jewelry School/Institute",
  "E-commerce Jewelry Platform",
  "Custom Jewelry Workshop",
  "Antique & Vintage Jewelry",
  "Other"
];

const SPECIALIZATIONS = [
  "Gold Jewelry",
  "Diamond Jewelry",
  "Silver Jewelry",
  "Platinum Jewelry",
  "Bridal Jewelry",
  "Fashion Jewelry",
  "Traditional Indian Jewelry",
  "Contemporary Designs",
  "Custom/Bespoke Jewelry",
  "Fine Jewelry",
  "Costume Jewelry",
  "Watches",
  "Gemstones & Diamonds (Loose)",
  "Lab-Grown Diamonds",
  "Repair & Restoration"
];

const CERTIFICATIONS = [
  "BIS Hallmark Certified",
  "ISO Certified",
  "RJC (Responsible Jewellery Council)",
  "Kimberley Process Certified",
  "Fair Trade Certified",
  "Conflict-Free Diamond Source",
  "GIA Authorized Dealer",
  "IGI Partner",
  "None"
];

const WORKSHOP_FACILITIES = [
  "In-house Design Studio",
  "CAD/CAM Lab",
  "3D Printing Facility",
  "Casting Workshop",
  "Stone Setting Department",
  "Polishing Unit",
  "Quality Testing Lab",
  "Gemology Lab",
  "Laser Engraving",
  "Photography Studio"
];

const BRANCH_TYPES = ["Retail Store", "Workshop", "Warehouse", "Office"];

export default function CompanyRegistration() {
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);

  const loggedUser = useSelector((state) => state.auth.user);
  const recruiterId = loggedUser?._id;

  const submithandler = async (values, { setSubmitting }) => {
    try {
      setApiError("");

      if (!recruiterId) {
        alert("Please login as recruiter first!");
        return;
      }

      // Client-side validation
      if (!values.companyName || !values.companyType || !values.size || 
          !values.establishedYear || !values.location || !values.description ||
          !values.contactEmail || !values.contactNumber) {
        alert("Please fill all required fields!");
        return;
      }

      console.log("Submitting values:", values);
      console.log("Branches:", branches);

      const formData = new FormData();

      // File field
      if (values.uploadLogo) {
        formData.append("uploadLogo", values.uploadLogo);
      }

      // Basic fields (strings/numbers)
      formData.append("companyName", values.companyName);
      formData.append("industry", values.industry);
      formData.append("companyType", values.companyType); // CRITICAL FIELD
      formData.append("size", values.size);
      formData.append("establishedYear", values.establishedYear);
      formData.append("website", values.website || "");
      formData.append("location", values.location);
      formData.append("description", values.description);
      formData.append("contactEmail", values.contactEmail);
      formData.append("contactNumber", values.contactNumber);
      formData.append("recruiterId", recruiterId);

      // Arrays and objects as JSON strings
      formData.append("specializations", JSON.stringify(values.specializations));
      formData.append("certifications", JSON.stringify(values.certifications));
      formData.append("workshopFacilities", JSON.stringify(values.workshopFacilities));
      formData.append("branches", JSON.stringify(branches));
      formData.append("socialMedia", JSON.stringify(values.socialMedia));

      // Debug: Log what's being sent
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await companyApi.post("/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Response:", response.data);

      alert("💎 " + response.data.message);
      localStorage.setItem("companyRegistered", "true");
      navigate("/recruiter/home/");

    } catch (error) {
      console.error("Registration error:", error);
      const errorMsg = error.response?.data?.message || "Something went wrong, please try again.";
      const missingFields = error.response?.data?.missing;
      
      if (missingFields) {
        console.log("Missing fields:", missingFields);
        const missing = Object.entries(missingFields)
          .filter(([key, value]) => value === true)
          .map(([key]) => key);
        
        if (missing.length > 0) {
          alert(`Missing required fields: ${missing.join(", ")}`);
        }
      }
      
      setApiError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: companyInitialValues,
    onSubmit: submithandler,
    // NO validation schema - we handle validation manually
  });

  const handleMultiSelect = (field, value) => {
    const currentValues = formik.values[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    formik.setFieldValue(field, newValues);
  };

  const addBranch = () => {
    setBranches([...branches, { city: "", address: "", type: "Retail Store" }]);
  };

  const updateBranch = (index, field, value) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };

  const removeBranch = (index) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-6">
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-8 border border-gray-200 mb-10">
        
        <div className="flex items-center gap-3 mb-6">
          <GiJewelCrown className="text-5xl text-blue-600" />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Jewelry Business Registration
            </h2>
            <p className="text-gray-600 text-sm">Register your jewelry company to start hiring</p>
          </div>
        </div>

        <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">

          {/* ========== JEWELRY BUSINESS SPECIFICS ========== */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <GiFactory className="text-2xl text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Business Information</h3>
              <span className="text-xs text-blue-600 font-semibold bg-white px-3 py-1 rounded-full ml-auto">
                Required
              </span>
            </div>

            {/* Company Type */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Business Type <span className="text-red-500">*</span>
              </label>
              <select
                name="companyType"
                value={formik.values.companyType}
                onChange={formik.handleChange}
                required
                className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                <option value="">Select Business Type</option>
                {COMPANY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {formik.touched.companyType && !formik.values.companyType && (
                <p className="text-red-500 text-sm mt-1">Business type is required</p>
              )}
            </div>

            {/* Specializations */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Specializations (Select multiple)
              </label>
              <div className="border-2 border-blue-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SPECIALIZATIONS.map(spec => (
                    <label key={spec} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition">
                      <input
                        type="checkbox"
                        checked={formik.values.specializations.includes(spec)}
                        onChange={() => handleMultiSelect('specializations', spec)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formik.values.specializations.length}
              </p>
            </div>

            {/* Certifications */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Certifications & Accreditations
              </label>
              <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {CERTIFICATIONS.map(cert => (
                    <label key={cert} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition">
                      <input
                        type="checkbox"
                        checked={formik.values.certifications.includes(cert)}
                        onChange={() => handleMultiSelect('certifications', cert)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{cert}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Workshop Facilities */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Workshop & Facilities
              </label>
              <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {WORKSHOP_FACILITIES.map(facility => (
                    <label key={facility} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition">
                      <input
                        type="checkbox"
                        checked={formik.values.workshopFacilities.includes(facility)}
                        onChange={() => handleMultiSelect('workshopFacilities', facility)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ========== BASIC INFORMATION ========== */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <GiDiamondRing className="text-blue-600" />
              Basic Information
            </h3>

            {/* Logo Upload */}
            <div>
              <label className="font-medium text-gray-700">Upload Company Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => formik.setFieldValue("uploadLogo", e.target.files[0])}
                className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Name */}
              <div>
                <label className="font-medium text-gray-700">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  required
                  placeholder="e.g., Tanishq Jewellery"
                  className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Established Year */}
              <div>
                <label className="font-medium text-gray-700">
                  Established Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={formik.values.establishedYear}
                  onChange={formik.handleChange}
                  required
                  placeholder="e.g., 1994"
                  min="1800"
                  max="2026"
                  className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Size */}
              <div>
                <label className="font-medium text-gray-700">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  value={formik.values.size}
                  onChange={formik.handleChange}
                  required
                  className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1–10 employees</option>
                  <option value="11-50">11–50 employees</option>
                  <option value="51-200">51–200 employees</option>
                  <option value="201-500">201–500 employees</option>
                  <option value="500+">500+ employees</option>
                </select>
              </div>

              {/* Website */}
              <div>
                <label className="font-medium text-gray-700">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  placeholder="https://www.example.com"
                  className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Head Office Location */}
            <div>
              <label className="font-medium text-gray-700">
                Head Office Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formik.values.location}
                onChange={formik.handleChange}
                required
                placeholder="e.g., Mumbai, Maharashtra"
                className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Email */}
              <div>
                <label className="font-medium text-gray-700">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formik.values.contactEmail}
                  onChange={formik.handleChange}
                  required
                  placeholder="contact@company.com"
                  className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contact Number */}
              <div>
                <label className="font-medium text-gray-700">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  required
                  placeholder="+91 1234567890"
                  className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="font-medium text-gray-700">
                Company Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                rows="4"
                value={formik.values.description}
                onChange={formik.handleChange}
                required
                placeholder="Tell us about your company, products, and services..."
                className="mt-2 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* ========== ADDITIONAL BRANCHES ========== */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Additional Locations / Branches</h3>
              <button
                type="button"
                onClick={addBranch}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
              >
                + Add Branch
              </button>
            </div>

            {branches.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No additional branches added yet</p>
            ) : (
              <div className="space-y-3">
                {branches.map((branch, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-300 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={branch.city}
                      onChange={(e) => updateBranch(index, 'city', e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={branch.address}
                      onChange={(e) => updateBranch(index, 'address', e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={branch.type}
                      onChange={(e) => updateBranch(index, 'type', e.target.value)}
                      className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {BRANCH_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeBranch(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ========== SOCIAL MEDIA ========== */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-gray-700 text-sm">Instagram</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/yourcompany"
                  value={formik.values.socialMedia.instagram}
                  onChange={(e) => formik.setFieldValue('socialMedia.instagram', e.target.value)}
                  className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 text-sm">Facebook</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/yourcompany"
                  value={formik.values.socialMedia.facebook}
                  onChange={(e) => formik.setFieldValue('socialMedia.facebook', e.target.value)}
                  className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 text-sm">Pinterest</label>
                <input
                  type="url"
                  placeholder="https://pinterest.com/yourcompany"
                  value={formik.values.socialMedia.pinterest}
                  onChange={(e) => formik.setFieldValue('socialMedia.pinterest', e.target.value)}
                  className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="font-medium text-gray-700 text-sm">YouTube</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@yourcompany"
                  value={formik.values.socialMedia.youtube}
                  onChange={(e) => formik.setFieldValue('socialMedia.youtube', e.target.value)}
                  className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* API ERROR */}
          {apiError && (
            <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{apiError}</p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Registering..." : "💎 Register Jewelry Business"}
            </button>

            <button
              type="button"
              onClick={() => {
                formik.resetForm();
                setBranches([]);
              }}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
