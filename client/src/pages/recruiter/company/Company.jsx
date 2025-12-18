import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CompanyView() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const company = useSelector((state) => state.company.data);
  console.log(company)

  if (!company) {
    return <p className="text-center mt-10">No company details found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h2 className="text-4xl font-bold mb-8 text-center">
        About Your Company
      </h2>

      <div className="bg-white shadow-lg rounded-2xl p-8 border">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-5 rounded-xl mb-8">
          {company.uploadLogo && (
            <img
              src={company.uploadLogo}
              alt="Company Logo"
              className="w-32 h-32 object-contain border rounded-xl"
            />
          )}

          <h3 className="text-3xl font-semibold flex-1 text-center md:text-left">
            {company.companyName}
          </h3>

          <button
            onClick={() => navigate(`/recruiter/company/edit/${company._id}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Edit
          </button>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <Detail label="Industry" value={company.industry} />
          <Detail label="Company Size" value={company.size} />
          <Detail label="Established Year" value={company.establishedYear} />
          <Detail label="Email" value={company.contactEmail} />
          <Detail label="Contact Number" value={company.contactNumber} />
          <Detail label="Location" value={company.location} />
        </div>

        <div className="mt-6">
          <p className="font-semibold">Website</p>
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline break-all"
            >
              {company.website}
            </a>
          ) : (
            <p>Not Provided</p>
          )}
        </div>

        <div className="mt-6">
          <p className="font-semibold">Description</p>
          <p className="text-gray-600">
            {company.description || "No description added."}
          </p>
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <p>
    <span className="font-semibold">{label}:</span>{" "}
    <span className="text-gray-600">{value || "Not Provided"}</span>
  </p>
);
