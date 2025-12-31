import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resumeApi } from "../../../../api/api";

export default function EditResume() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const resume = useSelector((state) => state.resume.data);

  const formik = useFormik({
    enableReinitialize: true, //  VERY IMPORTANT
    initialValues: {
      fullName: resume?.fullName || "",
      jobTitle: resume?.jobTitle || "",
      email: user?.email || "",
      phone: resume?.phone || "",
      address: resume?.address || "",
      summary: resume?.summary || "",

      skills: resume?.skills?.length ? resume.skills : [""],

      experiences: resume?.experiences?.length
        ? resume.experiences
        : [
          {
            companyName: "",
            experienceTitle: "",
            duration: "",
            workDetails: "",
          },
        ],

      education: resume?.education?.length
        ? resume.education
        : [{ degree: "", institution: "", year: "" }],

      languages: resume?.languages?.length ? resume.languages : [""],
    },

    onSubmit: async (values, { setSubmitting }) => {
      try {
        await resumeApi.put(`/update/${resume._id}`, values);
        alert("Resume saved successfully!");
        navigate("/candidate/resume");
      } catch (error) {
        console.error("Resume update error:", error);
        alert("Failed to save resume");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Edit Your Resume
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="font-semibold">Full Name</label>
          <input
            type="text"
            {...formik.getFieldProps("fullName")}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        {/* Job Title */}
        <div>
          <label className="font-semibold">Job Title</label>
          <input
            type="text"
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
            {...formik.getFieldProps("phone")}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        {/* Address */}
        <div>
          <label className="font-semibold">Address</label>
          <input
            type="text"
            {...formik.getFieldProps("address")}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="font-semibold">Professional Summary</label>
          <textarea
            rows="3"
            {...formik.getFieldProps("summary")}
            className="w-full mt-1 border rounded-lg p-2"
          />
        </div>

        {/* Skills */}
        <h3 className="text-xl font-semibold">Skills</h3>
        {formik.values.skills.map((skill, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              name={`skills[${index}]`}
              value={skill}
              onChange={formik.handleChange}
              className="flex-1 border rounded-lg p-2"
            />
            <button
              type="button"
              disabled={formik.values.skills.length === 1}
              className="px-3 bg-red-500 text-white rounded-lg"
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
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() =>
            formik.setFieldValue("skills", [...formik.values.skills, ""])
          }
        >
          + Add Skill
        </button>

        {/* Experiences */}
        <h3 className="text-xl font-semibold">Work Experience</h3>
        {formik.values.experiences.map((exp, index) => (
          <div key={index} className="border p-4 rounded-xl space-y-3 bg-gray-50">
            <input
              type="text"
              placeholder="Company Name"
              name={`experiences[${index}].companyName`}
              value={exp.companyName}
              onChange={formik.handleChange}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Job Title"
              name={`experiences[${index}].experienceTitle`}
              value={exp.experienceTitle}
              onChange={formik.handleChange}
              className="w-full border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Duration"
              name={`experiences[${index}].duration`}
              value={exp.duration}
              onChange={formik.handleChange}
              className="w-full border rounded-lg p-2"
            />
            <textarea
              placeholder="Work Details"
              rows="3"
              name={`experiences[${index}].workDetails`}
              value={exp.workDetails}
              onChange={formik.handleChange}
              className="w-full border rounded-lg p-2"
            />

            <button
              type="button"
              disabled={formik.values.experiences.length === 1}
              className="px-3 py-1 bg-red-500 text-white rounded-lg"
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

        {/* Languages */}
        <h3 className="text-xl font-semibold">Languages</h3>
        {formik.values.languages.map((lang, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              name={`languages[${index}]`}
              value={lang}
              onChange={formik.handleChange}
              className="flex-1 border rounded-lg p-2"
            />
            <button
              type="button"
              disabled={formik.values.languages.length === 1}
              className="px-3 bg-red-500 text-white rounded-lg"
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
            formik.setFieldValue("languages", [...formik.values.languages, ""])
          }
        >
          + Add Language
        </button>

        {/* Submit */}
        <button
          className="
              w-full
              bg-gray-600 
              text-white 
              py-3 
              rounded-xl 
              font-semibold 
              hover:bg-yellow-700 
              transition-all
              shadow-md"
          onClick={() => navigate("/candidate/applications/list")}>
          Back</button>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold"
        >
          {formik.isSubmitting ? "Saving..." : "Save Resume"}
        </button>
      </form>
    </div>
  );
}
