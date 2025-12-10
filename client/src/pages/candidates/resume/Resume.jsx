import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { resumeApi } from "../../../../api/api";

export default function EmployeeResume() {
  const [resume, setResume] = useState(null);

  const loggedUser = useSelector((state) => state.auth.user);
  const candidateId = loggedUser?._id;

  const fetchResume = async (candidateId) => {
    try {
      const response = await resumeApi.get(`/${candidateId}`);
      const data = response.data.data || response.data;
      setResume(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (candidateId) {
      fetchResume(candidateId);
    }
  }, [candidateId]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold">Resume</h1>
          <p className="text-lg text-gray-700">{resume?.fullName}</p>
        </div>
      </div>

      <hr className="my-4" />

      {/* Contact Info */}
      <section className="space-y-1">
        <p><span className="font-semibold">Email:</span> {resume?.email}</p>
        <p><span className="font-semibold">Phone:</span> {resume?.phone}</p>
        <p><span className="font-semibold">Address:</span> {resume?.address}</p>
      </section>

      <hr className="my-4" />

      {/* Summary */}
      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-1">Professional Summary</h3>
        <p className="text-gray-700">{resume?.summary}</p>
      </section>

      <hr className="my-4" />

      {/* Skills */}
      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <ul className="list-disc list-inside text-gray-700">
          {resume?.skills?.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      {/* Work Experience */}
      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
        {resume?.experiences?.map((exp, index) => (
          <div key={index} className="mb-3 p-3 border rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold">
              {exp.companyName} — {exp.experienceTitle}
            </h4>
            <p className="text-sm"><span className="font-bold">Duration:</span> {exp.duration}</p>
            <p className="mt-1">{exp.workDetails}</p>
          </div>
        ))}
      </section>

      <hr className="my-4" />

      {/* Education */}
      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Education</h3>
        {resume?.education?.map((edu, index) => (
          <p key={index} className="text-gray-700">
            {edu.degree} — {edu.institution} ({edu.year})
          </p>
        ))}
      </section>

      <hr className="my-4" />

      {/* Languages */}
      <section className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Languages</h3>
        <ul className="list-disc list-inside text-gray-700">
          {resume?.languages?.map((lang, index) => (
            <li key={index}>{lang}</li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      {/* Declaration */}
      <section className="mb-4">
        <p className="text-gray-800">
          <strong>Declaration:</strong> I confirm that the above information is true.
        </p>
      </section>
    </div>
  );
}
