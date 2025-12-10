import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { companyApi } from "../../../../api/api";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [Company, setCompany] = useState(null);

  const fetchCompanyByRecruiter = async (id) => {
    const response = await companyApi.get(`/recruiter/${id}`);
    const company = response.data.data || response.data;
    setCompany(company);
  };

  useEffect(() => {
    if (user?._id) fetchCompanyByRecruiter(user._id);
  }, [user]);

  if (!user) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  const role = user?.role;

 return (
  <div className="max-w-4xl mx-auto mt-10">
    
    {/* Profile Card */}
    <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      
      {/* Recruiter Section */}
      {role === "recruiter" ? (
        <>
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Recruiter Profile
          </h2>

          {/* USER INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Name</span>
              <span className="font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border">
                {user?.username || "Not Provided"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Email</span>
              <span className="font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border">
                {user?.email || "Not Provided"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Phone</span>
              <span className="font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border">
                {user?.phone || "Not Provided"}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-500 text-sm">Password</span>
              <span className="font-medium text-gray-900 p-3 bg-gray-50 rounded-lg border">
                🔒 Hidden for Security
              </span>
            </div>
          </div>

          <hr className="my-10" />

          {/* COMPANY SECTION */}
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Company Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm">Company Name</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.companyName || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Company Email</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.contactEmail || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.contactNumber || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Establishment Year</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.establishedYear || "Not Provided"}
              </p>
            </div>

            <div className="col-span-full">
              <p className="text-gray-500 text-sm">Description</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.description || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Industry</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.industry || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Location</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {Company?.location || "Not Provided"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Website</p>
              <a
                href={Company?.website}
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-gray-50 rounded-lg border text-blue-600 break-all block"
              >
                {Company?.website || "Not Provided"}
              </a>
            </div>
          </div>
        </>
      ) : role === "candidate" ? (
        <>
          <h2 className="text-3xl font-semibold mb-8 text-gray-800">
            Candidate Profile
          </h2>

          <div className="flex items-center gap-6 mb-8">
            <img
              src={user?.profileImage || "/default-user.png"}
              alt="Profile"
              className="w-28 h-28 rounded-xl border shadow-sm object-cover"
            />
            <div>
              <p className="text-gray-500 text-sm">Full Name</p>
              <p className="font-medium text-gray-900">{user?.username}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {user?.email}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Phone Number</p>
              <p className="p-3 bg-gray-50 rounded-lg border">
                {user?.phone || "Not Provided"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-center text-red-500">Not Authorized</p>
      )}
    </div>
  </div>
);

}
