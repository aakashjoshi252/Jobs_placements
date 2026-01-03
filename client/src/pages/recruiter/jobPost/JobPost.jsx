import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { jobsApi } from "../../../api/api";
import { useSelector } from "react-redux";
import { useState } from "react";
import { GiDiamondRing, GiCutDiamond, GiJewelCrown } from "react-icons/gi";

const initialValues = {
  title: "",
  description: "",
  
  // JEWELRY SPECIFIC FIELDS
  jewelryCategory: "",
  jewelrySpecialization: [],
  materialsExperience: [],
  techniquesProficiency: [],
  certifications: [],
  portfolioRequired: false,
  
  // GENERAL FIELDS
  jobLocation: "",
  jobType: "On-site",
  empType: "Full-time",
  experience: "Fresher",
  salary: "",
  openings: 1,
  deadline: "",
  skills: "",
  additionalRequirement: "",
  companyId: "",
  recruiterId: "",
  companyName: "",
  companyEmail: "",
  companyAddress: "",
};

// Jewelry data constants
const JEWELRY_CATEGORIES = [
  "Design",
  "Manufacturing",
  "Sales & Retail",
  "Quality Control",
  "Management",
  "CAD/CAM",
  "Gemology",
  "Other"
];

const SPECIALIZATIONS = [
  "Jewelry Designer",
  "CAD Designer",
  "3D Modeler",
  "Product Developer",
  "Goldsmith",
  "Silversmith",
  "Stone Setter",
  "Polisher",
  "Casting Specialist",
  "Engraver",
  "Bench Jeweler",
  "Laser Technician",
  "Gemologist",
  "Diamond Grader",
  "Gem Setter",
  "Quality Controller",
  "Quality Assurance Manager",
  "Sales Associate",
  "Store Manager",
  "Showroom Manager",
  "Sales Consultant",
  "Production Manager",
  "Workshop Manager",
  "Operations Manager",
  "Supply Chain Manager",
  "Photographer",
  "Marketing Specialist",
  "Customer Service"
];

const MATERIALS = [
  "Gold (22K, 18K, 14K)",
  "Silver (925 Sterling)",
  "Platinum",
  "Diamonds",
  "Precious Gemstones (Ruby, Sapphire, Emerald)",
  "Semi-Precious Stones",
  "Pearls",
  "Lab-Grown Diamonds",
  "Kundan",
  "Meenakari",
  "Polki",
  "Jadau"
];

const TECHNIQUES = [
  "Hand Fabrication",
  "CAD/CAM Design (Rhino, Matrix, JewelCAD)",
  "3D Printing",
  "Casting (Lost Wax, Investment)",
  "Stone Setting (Prong, Bezel, Pave, Channel)",
  "Soldering",
  "Polishing & Finishing",
  "Engraving (Hand/Laser)",
  "Enameling",
  "Filigree Work",
  "Traditional Indian Techniques"
];

const CERTIFICATIONS = [
  "GIA (Gemological Institute of America)",
  "IGI (International Gemological Institute)",
  "HRD Antwerp",
  "AGS (American Gem Society)",
  "NIGm (National Institute of Gemology Mumbai)",
  "BIS Hallmark Certification",
  "JJA (Jewellers Association)",
  "CAD Software Certification",
  "Not Required"
];

export default function JobPost() {
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.data);
  const navigate = useNavigate();
  const [showJewelryFields, setShowJewelryFields] = useState(false);

  const formik = useFormik({
    initialValues: {
      ...initialValues,
      recruiterId: user?._id || "",
      companyId: company?._id || "",
      companyName: company?.companyName || "",
      companyEmail: company?.contactEmail || "",
      companyAddress: company?.location || "",
    },
    enableReinitialize: true,

    onSubmit: async (values, { resetForm }) => {
      try {
        const payload = {
          ...values,
          skills: values.skills
            ? values.skills.split(",").map((s) => s.trim())
            : [],
        };
        await jobsApi.post("/create", payload);

        alert("💎 Job posted successfully!");
        resetForm();
        navigate("/recruiter/company/postedjobs");
      } catch (error) {
        alert(error.response?.data?.message || "Failed to post job");
      }
    },
  });

  const handleMultiSelect = (field, value) => {
    const currentValues = formik.values[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    formik.setFieldValue(field, newValues);
  };

  if (!company) {
    return (
      <div className="text-center mt-10">
        <GiDiamondRing className="text-6xl text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">
          No Company Found
        </h2>
        <p className="text-gray-600 mt-2">Register your jewelry business to start posting jobs</p>
        <button
          onClick={() => navigate("/recruiter/company/registration")}
          className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Register Your Company
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-6 mb-10">
      <div className="flex items-center gap-3 mb-6">
        <GiJewelCrown className="text-4xl text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Post a Jewelry Job</h2>
          <p className="text-gray-600 text-sm">Find the perfect candidate for your jewelry business</p>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">

        {/* ========== JEWELRY INDUSTRY SECTION ========== */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GiCutDiamond className="text-2xl text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Jewelry Industry Specifics</h3>
            </div>
            <span className="text-xs text-blue-600 font-semibold bg-white px-3 py-1 rounded-full">
              Required
            </span>
          </div>

          {/* Jewelry Category */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Job Category <span className="text-red-500">*</span>
            </label>
            <select
              name="jewelryCategory"
              value={formik.values.jewelryCategory}
              onChange={formik.handleChange}
              required
              className="w-full border-2 border-blue-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">Select Category</option>
              {JEWELRY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Specializations */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Required Specializations (Select multiple)
            </label>
            <div className="border-2 border-blue-300 rounded-lg p-4 max-h-48 overflow-y-auto bg-white">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {SPECIALIZATIONS.map(spec => (
                  <label key={spec} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      checked={formik.values.jewelrySpecialization.includes(spec)}
                      onChange={() => handleMultiSelect('jewelrySpecialization', spec)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{spec}</span>
                  </label>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selected: {formik.values.jewelrySpecialization.length}
            </p>
          </div>

          {/* Materials Experience */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Materials Experience
            </label>
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {MATERIALS.map(mat => (
                  <label key={mat} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      checked={formik.values.materialsExperience.includes(mat)}
                      onChange={() => handleMultiSelect('materialsExperience', mat)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{mat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Techniques Proficiency */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Required Technical Skills/Techniques
            </label>
            <div className="border-2 border-blue-300 rounded-lg p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TECHNIQUES.map(tech => (
                  <label key={tech} className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded transition">
                    <input
                      type="checkbox"
                      checked={formik.values.techniquesProficiency.includes(tech)}
                      onChange={() => handleMultiSelect('techniquesProficiency', tech)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{tech}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">
              Certifications
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

          {/* Portfolio Required */}
          <div className="mb-4">
            <label className="flex items-center gap-3 cursor-pointer bg-white p-4 rounded-lg border-2 border-blue-300 hover:bg-blue-50 transition">
              <input
                type="checkbox"
                name="portfolioRequired"
                checked={formik.values.portfolioRequired}
                onChange={formik.handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Portfolio Required</span>
                <p className="text-xs text-gray-500">Check if candidates must submit a design portfolio</p>
              </div>
            </label>
          </div>
        </div>

        {/* ========== GENERAL JOB DETAILS ========== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
              placeholder="e.g., Senior Jewelry Designer"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Job Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="jobLocation"
              value={formik.values.jobLocation}
              onChange={formik.handleChange}
              required
              placeholder="e.g., Mumbai, Maharashtra"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            required
            placeholder="Describe the role, responsibilities, and requirements..."
            className="w-full border border-gray-300 px-4 py-3 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Job Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Job Type</label>
            <select
              name="jobType"
              value={formik.values.jobType}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Employment Type</label>
            <select
              name="empType"
              value={formik.values.empType}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Hourly">Hourly</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Experience Level</label>
            <select
              name="experience"
              value={formik.values.experience}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Fresher">Fresher</option>
              <option value="Junior (1-3 years)">Junior (1-3 years)</option>
              <option value="Mid (3-6 years)">Mid (3-6 years)</option>
              <option value="Senior (6+ years)">Senior (6+ years)</option>
              <option value="Master Craftsman">Master Craftsman</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Salary */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Salary <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="salary"
              value={formik.values.salary}
              onChange={formik.handleChange}
              required
              placeholder="e.g., 3-5 LPA or 25k-40k/month"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Openings */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Number of Openings</label>
            <input
              type="number"
              name="openings"
              value={formik.values.openings}
              onChange={formik.handleChange}
              min="1"
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">Application Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formik.values.deadline}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* General Skills */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Additional Skills (Comma Separated)
          </label>
          <input
            type="text"
            name="skills"
            placeholder="e.g., Team Management, Client Communication, MS Office"
            value={formik.values.skills}
            onChange={formik.handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Additional Requirements */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Additional Requirements
          </label>
          <textarea
            name="additionalRequirement"
            value={formik.values.additionalRequirement}
            onChange={formik.handleChange}
            placeholder="Any other specific requirements, benefits, or information..."
            className="w-full border border-gray-300 px-4 py-3 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Company Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Company Information (Auto-filled)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={formik.values.companyName}
              disabled
              className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            />
            <input
              type="email"
              value={formik.values.companyEmail}
              disabled
              className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            />
            <input
              type="text"
              value={formik.values.companyAddress}
              disabled
              className="border border-gray-300 px-4 py-2 rounded-lg bg-gray-100 text-gray-600"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg hover:shadow-xl"
          >
            💎 Post Jewelry Job
          </button>

          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Reset Form
          </button>
        </div>
      </form>
    </div>
  );
}
