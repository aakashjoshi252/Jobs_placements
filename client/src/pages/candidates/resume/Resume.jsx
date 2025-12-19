import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function EmployeeResume() {
  const navigate = useNavigate();
  const resume = useSelector((state) => state.resume.data);

  if (!resume) {
    return (
      <div className="max-w-3xl mx-auto p-6 mt-6 text-center">
        <p className="text-lg">No resume found. Please create your resume.</p>
        <button
          onClick={() => navigate("/candidate/create-resume")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Resume
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">Resume</h1>
          <p className="text-lg text-gray-700">{resume.fullName}</p>
        </div>
      </div>

      <hr className="my-4" />

      <section className="space-y-1">
        <p><span className="font-semibold">Email:</span> {resume.email}</p>
        <p><span className="font-semibold">Phone:</span> {resume.phone}</p>
        <p><span className="font-semibold">Address:</span> {resume.address}</p>
      </section>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-1">Professional Summary</h3>
        <p className="text-gray-700">{resume.summary}</p>
      </section>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <ul className="list-disc list-inside text-gray-700">
          {resume.skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
        {resume.experiences?.map((exp, index) => (
          <div key={index} className="mb-3 p-3 border rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold">{exp.companyName} — {exp.experienceTitle}</h4>
            <p className="text-sm"><span className="font-bold">Duration:</span> {exp.duration}</p>
            <p className="mt-1">{exp.workDetails}</p>
          </div>
        ))}
      </section>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        {resume.education?.map((edu, index) => (
          <p key={index} className="text-gray-700">{edu.degree} — {edu.institution} ({edu.year})</p>
        ))}
      </section>

      <hr className="my-4" />

      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Languages</h3>
        <ul className="list-disc list-inside text-gray-700">
          {resume.languages?.map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      <section className="text-right">
        <button
          onClick={() => navigate("/candidate/edit-resume")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Resume
        </button>
        <button onClick={()=>navigate(-1)}>Back</button>
      </section>
    </div>
  );
}
