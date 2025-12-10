import { resumeApi } from "../../../../../api/api";
import { useFormik } from "formik";
import { useSelector } from "react-redux";

export default function ResumeForm() {
    const loggedUser = useSelector((state) => state.auth.user);
    const candidateId = loggedUser?._id;
    const candidateEmail = loggedUser?.email;

    const formik = useFormik({
        initialValues: {
            fullName: "",
            jobTitle: "",
            email: candidateEmail,
            phone: "",
            address: "",
            summary: "",
            skills: [""],
            experiences: [
                { companyName: "", experienceTitle: "", duration: "", workDetails: "" }
            ],
            education: [{ degree: "", institution: "", year: "" }],
            languages: [""],
            candidateId,
        },

        onSubmit: (values, { setSubmitting }) => {
            setSubmitting(true);
            resumeApi
                .post(`/create`, values)
                .then(() => alert("Resume Saved Successfully!"))
                .catch((err) => console.log(err))
                .finally(() => setSubmitting(false));
        },
    });

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Your Resume</h2>

            <form onSubmit={formik.handleSubmit} className="space-y-6">

                {/* Full Name */}
                <div>
                    <label className="font-semibold">Full Name</label>
                    <input
                        type="text"
                        required
                        {...formik.getFieldProps("fullName")}
                        className="w-full mt-1 border rounded-lg p-2"
                    />
                </div>

                {/* Job Title */}
                <div>
                    <label className="font-semibold">Job Title</label>
                    <input
                        type="text"
                        required
                        {...formik.getFieldProps("jobTitle")}
                        className="w-full mt-1 border rounded-lg p-2"
                    />
                </div>

                <input type="hidden" {...formik.getFieldProps("email")} />

                {/* Phone */}
                <div>
                    <label className="font-semibold">Phone</label>
                    <input
                        type="text"
                        required
                        {...formik.getFieldProps("phone")}
                        className="w-full mt-1 border rounded-lg p-2"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="font-semibold">Address</label>
                    <input
                        type="text"
                        required
                        {...formik.getFieldProps("address")}
                        className="w-full mt-1 border rounded-lg p-2"
                    />
                </div>

                {/* Summary */}
                <div>
                    <label className="font-semibold">Professional Summary</label>
                    <textarea
                        rows="3"
                        required
                        {...formik.getFieldProps("summary")}
                        className="w-full mt-1 border rounded-lg p-2"
                    />
                </div>

                {/* Skills */}
                <h3 className="text-xl font-semibold mt-6">Skills</h3>
                {formik.values.skills.map((skill, index) => (
                    <div key={index} className="space-y-1">
                        <label className="font-medium">Skill {index + 1}</label>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                name={`skills[${index}]`}
                                value={skill}
                                onChange={formik.handleChange}
                                className="flex-1 border rounded-lg p-2"
                            />
                            <button
                                type="button"
                                className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400"
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
                    </div>
                ))}
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() =>
                        formik.setFieldValue("skills", [...formik.values.skills, ""])
                    }
                >
                    + Add Skill
                </button>

                {/* Work Experience */}
                <h3 className="text-xl font-semibold mt-6">Work Experience</h3>
                {formik.values.experiences.map((exp, index) => (
                    <div key={index} className="border rounded-xl p-4 space-y-4 bg-gray-50">
                        <div>
                            <label>Company Name</label>
                            <input
                                type="text"
                                name={`experiences[${index}].companyName`}
                                value={exp.companyName}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <div>
                            <label>Job Title</label>
                            <input
                                type="text"
                                name={`experiences[${index}].experienceTitle`}
                                value={exp.experienceTitle}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <div>
                            <label>Duration</label>
                            <input
                                type="text"
                                name={`experiences[${index}].duration`}
                                value={exp.duration}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <div>
                            <label>Work Details</label>
                            <textarea
                                rows="3"
                                name={`experiences[${index}].workDetails`}
                                value={exp.workDetails}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400"
                            disabled={formik.values.experiences.length === 1}
                            onClick={() => {
                                const updated = [...formik.values.experiences];
                                updated.splice(index, 1);
                                formik.setFieldValue("experiences", updated);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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

                {/* Education */}
                <h3 className="text-xl font-semibold mt-6">Education</h3>
                {formik.values.education.map((edu, index) => (
                    <div key={index} className="space-y-4 border rounded-xl p-4 bg-gray-50">
                        <div>
                            <label>Degree</label>
                            <input
                                type="text"
                                name={`education[${index}].degree`}
                                value={edu.degree}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <div>
                            <label>Institution</label>
                            <input
                                type="text"
                                name={`education[${index}].institution`}
                                value={edu.institution}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <div>
                            <label>Year</label>
                            <input
                                type="text"
                                name={`education[${index}].year`}
                                value={edu.year}
                                onChange={formik.handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            />
                        </div>

                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400"
                            disabled={formik.values.education.length === 1}
                            onClick={() => {
                                const updated = [...formik.values.education];
                                updated.splice(index, 1);
                                formik.setFieldValue("education", updated);
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() =>
                        formik.setFieldValue("education", [
                            ...formik.values.education,
                            { degree: "", institution: "", year: "" },
                        ])
                    }
                >
                    + Add Education
                </button>

                {/* Languages */}
                <h3 className="text-xl font-semibold mt-6">Languages</h3>
                {formik.values.languages.map((lang, index) => (
                    <div key={index} className="flex gap-3 items-center">
                        <input
                            type="text"
                            name={`languages[${index}]`}
                            value={lang}
                            onChange={formik.handleChange}
                            placeholder="Enter Language"
                            className="flex-1 border rounded-lg p-2"
                            required
                        />
                        <button
                            type="button"
                            className="px-4 py-2 bg-red-500 text-white rounded-lg disabled:bg-gray-400"
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() =>
                        formik.setFieldValue("languages", [
                            ...formik.values.languages,
                            "",
                        ])
                    }
                >
                    + Add Language
                </button>

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full py-3 bg-green-600 text-white rounded-lg mt-4 text-lg font-semibold disabled:bg-gray-400"
                    disabled={formik.isSubmitting}
                >
                    {formik.isSubmitting ? "Saving..." : "Save Resume"}
                </button>
            </form>
        </div>
    );
}
