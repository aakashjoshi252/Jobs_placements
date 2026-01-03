import { resumeApi } from "../../../../api/api";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useState } from "react";
import { GiDiamondRing, GiCutDiamond, GiJewelCrown } from "react-icons/gi";
import { FaCertificate, FaImage, FaGem } from "react-icons/fa";

const SPECIALIZATIONS = [
  "Jewelry Designer",
  "CAD Designer",
  "Goldsmith",
  "Silversmith",
  "Stone Setter",
  "Polisher",
  "Gemologist",
  "Diamond Grader",
  "Quality Controller",
  "Sales Consultant",
  "Store Manager",
  "Production Manager",
  "Bench Jeweler",
  "Engraver",
  "Casting Specialist",
  "Other"
];

const MATERIALS_EXPERTISE = [
  "Gold (22K, 18K, 14K)",
  "Silver (925 Sterling)",
  "Platinum",
  "Diamonds",
  "Precious Gemstones",
  "Semi-Precious Stones",
  "Pearls",
  "Lab-Grown Diamonds",
  "Kundan",
  "Meenakari",
  "Polki"
];

const TECHNICAL_SKILLS = [
  "Hand Fabrication",
  "CAD/CAM (Rhino, Matrix, JewelCAD)",
  "3D Printing",
  "Casting",
  "Stone Setting",
  "Soldering",
  "Polishing",
  "Engraving",
  "Enameling",
  "Filigree Work",
  "Traditional Techniques"
];

const CERTIFICATIONS = [
  "GIA (Gemological Institute of America)",
  "IGI (International Gemological Institute)",
  "HRD Antwerp",
  "AGS (American Gem Society)",
  "NIGm (National Institute of Gemology Mumbai)",
  "BIS Hallmark Certification",
  "JJA (Jewellers Association)",
  "CAD Software Certification (Rhino, Matrix, JewelCAD)",
  "3D Printing Certification",
  "Jewelry Design Diploma",
  "Goldsmith Certification",
  "Other"
];

const PORTFOLIO_CATEGORIES = [
  "Ring",
  "Necklace",
  "Bracelet",
  "Earring",
  "Pendant",
  "Brooch",
  "Custom Design",
  "CAD Model",
  "Other"
];

export default function ResumeForm() {
    const loggedUser = useSelector((state) => state.auth.user);
    const candidateId = loggedUser?._id;
    const candidateEmail = loggedUser?.email;
    const [activeTab, setActiveTab] = useState('basic');

    const formik = useFormik({
        initialValues: {
            fullName: "",
            jobTitle: "",
            email: candidateEmail,
            phone: "",
            address: "",
            summary: "",
            
            // JEWELRY SPECIFIC
            specialization: [],
            materialsExpertise: [],
            technicalSkills: [],
            
            skills: [""],
            experiences: [
                { companyName: "", experienceTitle: "", duration: "", workDetails: "" }
            ],
            education: [{ degree: "", institution: "", year: "" }],
            
            // NEW: Certifications
            certifications: [],
            
            // NEW: Portfolio
            portfolio: [],
            portfolioWebsite: "",
            
            languages: [""],
            candidateId,
        },

        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true);
            console.log("Submitting resume:", values);
            resumeApi
                .post(`/create`, values)
                .then((response) => {
                    alert("💎 Resume Saved Successfully!");
                    console.log("Response:", response.data);
                })
                .catch((err) => {
                    console.error("Error:", err);
                    alert("Error saving resume: " + (err.response?.data?.message || err.message));
                })
                .finally(() => setSubmitting(false));
        },
    });

    const handleMultiSelect = (field, value) => {
        const current = formik.values[field];
        const updated = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        formik.setFieldValue(field, updated);
    };

    const addCertification = () => {
        formik.setFieldValue('certifications', [
            ...formik.values.certifications,
            {
                name: '',
                issuingOrganization: '',
                issueDate: '',
                expiryDate: '',
                certificateUrl: ''
            }
        ]);
    };

    const removeCertification = (index) => {
        const updated = [...formik.values.certifications];
        updated.splice(index, 1);
        formik.setFieldValue('certifications', updated);
    };

    const addPortfolio = () => {
        formik.setFieldValue('portfolio', [
            ...formik.values.portfolio,
            {
                title: '',
                description: '',
                imageUrl: '',
                category: '',
                materials: [],
                techniques: [],
                year: ''
            }
        ]);
    };

    const removePortfolio = (index) => {
        const updated = [...formik.values.portfolio];
        updated.splice(index, 1);
        formik.setFieldValue('portfolio', updated);
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="bg-white shadow-xl rounded-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-3">
                        <GiJewelCrown className="text-5xl" />
                        <div>
                            <h2 className="text-3xl font-bold">Create Your Jewelry Industry Resume</h2>
                            <p className="text-blue-100 text-sm">Showcase your expertise in jewelry craftsmanship</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b bg-gray-50">
                    {[
                        { id: 'basic', label: 'Basic Info', icon: '📋' },
                        { id: 'jewelry', label: 'Jewelry Expertise', icon: '💎' },
                        { id: 'experience', label: 'Experience', icon: '💼' },
                        { id: 'certifications', label: 'Certifications', icon: '🏆' },
                        { id: 'portfolio', label: 'Portfolio', icon: '🖼️' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-4 px-4 font-semibold transition ${
                                activeTab === tab.id
                                    ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={formik.handleSubmit} className="p-8">

                    {/* ========== BASIC INFO TAB ========== */}
                    {activeTab === 'basic' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <GiDiamondRing className="text-blue-600" />
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-semibold text-gray-700">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        {...formik.getFieldProps("fullName")}
                                        className="w-full mt-2 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Rajesh Kumar"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-700">Job Title *</label>
                                    <input
                                        type="text"
                                        required
                                        {...formik.getFieldProps("jobTitle")}
                                        className="w-full mt-2 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="e.g., Senior Jewelry Designer"
                                    />
                                </div>
                            </div>

                            <input type="hidden" {...formik.getFieldProps("email")} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-semibold text-gray-700">Phone *</label>
                                    <input
                                        type="text"
                                        required
                                        {...formik.getFieldProps("phone")}
                                        className="w-full mt-2 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="+91 1234567890"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold text-gray-700">Address *</label>
                                    <input
                                        type="text"
                                        required
                                        {...formik.getFieldProps("address")}
                                        className="w-full mt-2 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-semibold text-gray-700">Professional Summary *</label>
                                <textarea
                                    rows="4"
                                    required
                                    {...formik.getFieldProps("summary")}
                                    className="w-full mt-2 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                    placeholder="Describe your expertise, experience, and career goals in the jewelry industry..."
                                />
                            </div>

                            {/* General Skills */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">General Skills</h4>
                                {formik.values.skills.map((skill, index) => (
                                    <div key={index} className="flex gap-3 mb-3">
                                        <input
                                            type="text"
                                            name={`skills[${index}]`}
                                            value={skill}
                                            onChange={formik.handleChange}
                                            className="flex-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., Customer Service, Team Management"
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                                            disabled={formik.values.skills.length === 1}
                                            onClick={() => {
                                                const updated = [...formik.values.skills];
                                                updated.splice(index, 1);
                                                formik.setFieldValue("skills", updated);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() =>
                                        formik.setFieldValue("skills", [...formik.values.skills, ""])
                                    }
                                >
                                    + Add Skill
                                </button>
                            </div>

                            {/* Languages */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">Languages</h4>
                                {formik.values.languages.map((lang, index) => (
                                    <div key={index} className="flex gap-3 mb-3">
                                        <input
                                            type="text"
                                            name={`languages[${index}]`}
                                            value={lang}
                                            onChange={formik.handleChange}
                                            placeholder="e.g., English, Hindi, Gujarati"
                                            className="flex-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                                            disabled={formik.values.languages.length === 1}
                                            onClick={() => {
                                                const updated = [...formik.values.languages];
                                                updated.splice(index, 1);
                                                formik.setFieldValue("languages", updated);
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    onClick={() =>
                                        formik.setFieldValue("languages", [
                                            ...formik.values.languages,
                                            "",
                                        ])
                                    }
                                >
                                    + Add Language
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========== JEWELRY EXPERTISE TAB ========== */}
                    {activeTab === 'jewelry' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <GiCutDiamond className="text-blue-600" />
                                Jewelry Industry Expertise
                            </h3>

                            {/* Specializations */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-3 block">
                                    <FaGem className="inline mr-2 text-blue-600" />
                                    Your Specializations (Select multiple)
                                </label>
                                <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50 max-h-64 overflow-y-auto">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {SPECIALIZATIONS.map(spec => (
                                            <label key={spec} className="flex items-center gap-2 cursor-pointer hover:bg-blue-100 p-2 rounded transition">
                                                <input
                                                    type="checkbox"
                                                    checked={formik.values.specialization.includes(spec)}
                                                    onChange={() => handleMultiSelect('specialization', spec)}
                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">{spec}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Selected: {formik.values.specialization.length}
                                </p>
                            </div>

                            {/* Materials Expertise */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-3 block">
                                    Materials Expertise
                                </label>
                                <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {MATERIALS_EXPERTISE.map(material => (
                                            <label key={material} className="flex items-center gap-2 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
                                                <input
                                                    type="checkbox"
                                                    checked={formik.values.materialsExpertise.includes(material)}
                                                    onChange={() => handleMultiSelect('materialsExpertise', material)}
                                                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                                                />
                                                <span className="text-sm text-gray-700">{material}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Technical Skills */}
                            <div>
                                <label className="font-semibold text-gray-700 mb-3 block">
                                    Technical Skills & Techniques
                                </label>
                                <div className="border-2 border-green-300 rounded-lg p-4 bg-green-50">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {TECHNICAL_SKILLS.map(skill => (
                                            <label key={skill} className="flex items-center gap-2 cursor-pointer hover:bg-green-100 p-2 rounded transition">
                                                <input
                                                    type="checkbox"
                                                    checked={formik.values.technicalSkills.includes(skill)}
                                                    onChange={() => handleMultiSelect('technicalSkills', skill)}
                                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                                />
                                                <span className="text-sm text-gray-700">{skill}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ========== EXPERIENCE TAB ========== */}
                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                            {/* Work Experience */}
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Work Experience</h3>
                                {formik.values.experiences.map((exp, index) => (
                                    <div key={index} className="border-2 border-gray-300 rounded-xl p-6 mb-4 space-y-4 bg-gray-50">
                                        <h4 className="font-semibold text-lg text-gray-800">Experience #{index + 1}</h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-medium text-gray-700">Company Name *</label>
                                                <input
                                                    type="text"
                                                    name={`experiences[${index}].companyName`}
                                                    value={exp.companyName}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., Tanishq Jewellery"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="font-medium text-gray-700">Job Title *</label>
                                                <input
                                                    type="text"
                                                    name={`experiences[${index}].experienceTitle`}
                                                    value={exp.experienceTitle}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., Senior Goldsmith"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Duration *</label>
                                            <input
                                                type="text"
                                                name={`experiences[${index}].duration`}
                                                value={exp.duration}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., Jan 2020 - Present"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Work Details *</label>
                                            <textarea
                                                rows="4"
                                                name={`experiences[${index}].workDetails`}
                                                value={exp.workDetails}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 resize-none"
                                                placeholder="Describe your responsibilities, achievements, and projects..."
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                                            disabled={formik.values.experiences.length === 1}
                                            onClick={() => {
                                                const updated = [...formik.values.experiences];
                                                updated.splice(index, 1);
                                                formik.setFieldValue("experiences", updated);
                                            }}
                                        >
                                            Remove Experience
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                    onClick={() =>
                                        formik.setFieldValue("experiences", [
                                            ...formik.values.experiences,
                                            {
                                                companyName: "",
                                                experienceTitle: "",
                                                duration: "",
                                                workDetails: "",
                                            },
                                        ])
                                    }
                                >
                                    + Add Experience
                                </button>
                            </div>

                            {/* Education */}
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">Education</h3>
                                {formik.values.education.map((edu, index) => (
                                    <div key={index} className="border-2 border-gray-300 rounded-xl p-6 mb-4 space-y-4 bg-gray-50">
                                        <h4 className="font-semibold text-lg text-gray-800">Education #{index + 1}</h4>
                                        
                                        <div>
                                            <label className="font-medium text-gray-700">Degree / Certification *</label>
                                            <input
                                                type="text"
                                                name={`education[${index}].degree`}
                                                value={edu.degree}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., Diploma in Jewelry Design"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Institution *</label>
                                            <input
                                                type="text"
                                                name={`education[${index}].institution`}
                                                value={edu.institution}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., National Institute of Jewelry Design"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Year *</label>
                                            <input
                                                type="text"
                                                name={`education[${index}].year`}
                                                value={edu.year}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                                                placeholder="e.g., 2018 - 2020"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400"
                                            disabled={formik.values.education.length === 1}
                                            onClick={() => {
                                                const updated = [...formik.values.education];
                                                updated.splice(index, 1);
                                                formik.setFieldValue("education", updated);
                                            }}
                                        >
                                            Remove Education
                                        </button>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                    onClick={() =>
                                        formik.setFieldValue("education", [
                                            ...formik.values.education,
                                            { degree: "", institution: "", year: "" },
                                        ])
                                    }
                                >
                                    + Add Education
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ========== CERTIFICATIONS TAB ========== */}
                    {activeTab === 'certifications' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaCertificate className="text-yellow-600" />
                                    Professional Certifications
                                </h3>
                                <button
                                    type="button"
                                    onClick={addCertification}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                                >
                                    + Add Certification
                                </button>
                            </div>

                            {formik.values.certifications.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">No certifications added yet</p>
                                    <button
                                        type="button"
                                        onClick={addCertification}
                                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                                    >
                                        Add Your First Certification
                                    </button>
                                </div>
                            ) : (
                                formik.values.certifications.map((cert, index) => (
                                    <div key={index} className="border-2 border-yellow-300 rounded-xl p-6 bg-yellow-50 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-lg text-gray-800">Certification #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeCertification(index)}
                                                className="text-red-600 hover:text-red-800 font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Certification Name *</label>
                                            <select
                                                name={`certifications[${index}].name`}
                                                value={cert.name}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                                                required
                                            >
                                                <option value="">Select Certification</option>
                                                {CERTIFICATIONS.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Issuing Organization *</label>
                                            <input
                                                type="text"
                                                name={`certifications[${index}].issuingOrganization`}
                                                value={cert.issuingOrganization}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                                                placeholder="e.g., GIA, IGI"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-medium text-gray-700">Issue Date</label>
                                                <input
                                                    type="month"
                                                    name={`certifications[${index}].issueDate`}
                                                    value={cert.issueDate}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="font-medium text-gray-700">Expiry Date (if any)</label>
                                                <input
                                                    type="month"
                                                    name={`certifications[${index}].expiryDate`}
                                                    value={cert.expiryDate}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Certificate URL (optional)</label>
                                            <input
                                                type="url"
                                                name={`certifications[${index}].certificateUrl`}
                                                value={cert.certificateUrl}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* ========== PORTFOLIO TAB ========== */}
                    {activeTab === 'portfolio' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaImage className="text-purple-600" />
                                    Design Portfolio
                                </h3>
                                <button
                                    type="button"
                                    onClick={addPortfolio}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                                >
                                    + Add Portfolio Item
                                </button>
                            </div>

                            {/* Portfolio Website */}
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border-2 border-purple-200">
                                <label className="font-semibold text-gray-700 mb-2 block">
                                    Portfolio Website / Online Profile
                                </label>
                                <input
                                    type="url"
                                    {...formik.getFieldProps("portfolioWebsite")}
                                    className="w-full border-2 border-purple-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                                    placeholder="https://your-portfolio.com or Behance/Instagram link"
                                />
                                <p className="text-xs text-gray-600 mt-1">Add your Behance, Instagram, personal website, or online portfolio link</p>
                            </div>

                            {formik.values.portfolio.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                    <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-600">No portfolio items added yet</p>
                                    <button
                                        type="button"
                                        onClick={addPortfolio}
                                        className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                                    >
                                        Add Your First Design
                                    </button>
                                </div>
                            ) : (
                                formik.values.portfolio.map((item, index) => (
                                    <div key={index} className="border-2 border-purple-300 rounded-xl p-6 bg-purple-50 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-lg text-gray-800">Portfolio Item #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removePortfolio(index)}
                                                className="text-red-600 hover:text-red-800 font-semibold"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-medium text-gray-700">Design Title *</label>
                                                <input
                                                    type="text"
                                                    name={`portfolio[${index}].title`}
                                                    value={item.title}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                                                    placeholder="e.g., Bridal Necklace Set"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="font-medium text-gray-700">Category *</label>
                                                <select
                                                    name={`portfolio[${index}].category`}
                                                    value={item.category}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                                                    required
                                                >
                                                    <option value="">Select Category</option>
                                                    {PORTFOLIO_CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Image URL *</label>
                                            <input
                                                type="url"
                                                name={`portfolio[${index}].imageUrl`}
                                                value={item.imageUrl}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                                                placeholder="https://... (Imgur, Google Drive, or portfolio link)"
                                                required
                                            />
                                            <p className="text-xs text-gray-600 mt-1">Upload image to Imgur/Google Drive and paste link here</p>
                                        </div>

                                        <div>
                                            <label className="font-medium text-gray-700">Description</label>
                                            <textarea
                                                rows="3"
                                                name={`portfolio[${index}].description`}
                                                value={item.description}
                                                onChange={formik.handleChange}
                                                className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 resize-none"
                                                placeholder="Describe the design, inspiration, and techniques used..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="font-medium text-gray-700">Materials Used</label>
                                                <input
                                                    type="text"
                                                    name={`portfolio[${index}].materials`}
                                                    value={item.materials.join(', ')}
                                                    onChange={(e) => {
                                                        const materials = e.target.value.split(',').map(m => m.trim());
                                                        formik.setFieldValue(`portfolio[${index}].materials`, materials);
                                                    }}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                                                    placeholder="e.g., 18K Gold, Diamond, Ruby (comma separated)"
                                                />
                                            </div>

                                            <div>
                                                <label className="font-medium text-gray-700">Year</label>
                                                <input
                                                    type="text"
                                                    name={`portfolio[${index}].year`}
                                                    value={item.year}
                                                    onChange={formik.handleChange}
                                                    className="w-full mt-1 border-2 border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                                                    placeholder="e.g., 2024"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4 pt-8 border-t-2 mt-8">
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg text-lg font-bold hover:from-green-700 hover:to-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Saving Resume..." : "💎 Save Resume"}
                        </button>

                        <button
                            type="button"
                            onClick={() => formik.resetForm()}
                            className="px-8 py-4 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                            Reset Form
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                const tabs = ['basic', 'jewelry', 'experience', 'certifications', 'portfolio'];
                                const current = tabs.indexOf(activeTab);
                                if (current > 0) setActiveTab(tabs[current - 1]);
                            }}
                            disabled={activeTab === 'basic'}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            ← Previous
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                const tabs = ['basic', 'jewelry', 'experience', 'certifications', 'portfolio'];
                                const current = tabs.indexOf(activeTab);
                                if (current < tabs.length - 1) setActiveTab(tabs[current + 1]);
                            }}
                            disabled={activeTab === 'portfolio'}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
