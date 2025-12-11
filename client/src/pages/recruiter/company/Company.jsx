import { useState } from "react";
import { useSelector } from "react-redux";

const CompanyView = () => {
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

    {/* Loading / Error States */}
    {loading ? (
      <p className="text-gray-700 text-lg text-center">Loading company details...</p>
    ) : error ? (
      <p className="text-red-600 font-medium text-center">{error}</p>
    ) : company ? (
      <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 sm:p-8 lg:p-10 transition-transform hover:scale-[1.02] duration-300">

        {/* Logo & Name */}
        {company.uploadLogo && (
          <div className="mb-8 flex flex-col md:flex-row items-center md:items-start md:gap-6 bg-gray-50 p-4 rounded-xl shadow-sm">
            <img
              src={company.uploadLogo.startsWith("http") ? company.uploadLogo : `/uploads/${company.uploadLogo}`}
              alt="Company Logo"
              className="w-28 h-28 sm:w-36 sm:h-36 object-contain border-2 rounded-xl shadow-sm"
            />
            <h3 className="mt-4 md:mt-0 text-2xl sm:text-3xl font-semibold text-gray-800 text-center md:text-left">
              {company.companyName}
            </h3>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-gray-700">
          {/* Left Column */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-900">Industry:</span>{" "}
              <span className="text-gray-600">{company.industry || "Not Provided"}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Company Size:</span>{" "}
              <span className="text-gray-600">{company.size || "Not Provided"}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Established Year:</span>{" "}
              <span className="text-gray-600">{company.establishedYear || "Not Provided"}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              <span className="text-gray-600">{company.contactEmail || "Not Provided"}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Contact Number:</span>{" "}
              <span className="text-gray-600">{company.contactNumber || "Not Provided"}</span>
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-gray-900">Location:</span>{" "}
              <span className="text-gray-600">{company.location || "Not Provided"}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Website:</span>{" "}
              {company.website ? (
                <a
                  className="text-blue-600 underline hover:text-blue-800 break-all"
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {company.website}
                </a>
              ) : (
                <span className="text-gray-600">Not Provided</span>
              )}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Recruiter Email:</span>{" "}
              <span className="text-gray-600">{user?.email || "Not Provided"}</span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">Description:</span>
              <br />
              <span className="text-gray-600">{company.description || "No description added."}</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} {company.companyName}. All rights reserved.
        </p>
      </div>
    ) : (
      <p className="text-gray-600 text-center">No company details found.</p>
    )}
  </div>
);

};

export default CompanyView;
