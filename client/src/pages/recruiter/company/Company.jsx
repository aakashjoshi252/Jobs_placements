import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { companyApi } from "../../../../api/api";

const CompanyView = () => {
  const [companyData, setCompanyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchCompanyByRecruiter = async () => {
      if (!user?._id) return;

      setLoading(true);
      setError("");

      try {
        const response = await companyApi.get(`/recruiter/${user._id}`);
        const allCompanies = response.data.data || response.data;
        setCompanyData(allCompanies);
      } catch (err) {
        console.error("Error fetching company details:", err);
        setError("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyByRecruiter();
  }, [user]);

  return (
    <div className=" max-w-3xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        About Your Company
      </h2>

      {loading ? (
        <p className="text-gray-700 text-lg">Loading company details...</p>
      ) : error ? (
        <p className="text-red-600 font-medium">{error}</p>
      ) : companyData ? (
        <div className="flex">
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Name: <span className="font-normal">{companyData.companyName}</span>
            </h3>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Email:</span> {companyData.contactEmail}
            </p>

            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Address:</span> {companyData.location}
            </p>

            <p className="text-gray-700">
              <span className="font-semibold">Recruiter:</span> {user?.email}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No company details found.</p>
      )}
    </div>
  );
};

export default CompanyView;
