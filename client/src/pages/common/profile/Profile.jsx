import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { companyApi } from "../../../../api/api";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCompany = async (recruiterId) => {
    try {
      const response = await companyApi.get(`/recruiter/${recruiterId}`);
      const companyData = response.data.data || response.data;
      setCompany(companyData);
    } catch (err) {
      console.error("Failed to load company:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && user.role === "recruiter") {
      fetchCompany(user._id);
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user || loading)
    return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  const role = user?.role;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">

        {/* ------------------ RECRUITER VIEW ------------------ */}
        {role === "recruiter" && (
          <>
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">
              Recruiter Profile
            </h2>

            {/* USER INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Name" value={user.username} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Phone" value={user.phone} />
              <ProfileField label="Password" value="🔒 Hidden for Security" />
            </div>

            <hr className="my-10" />

            {/* COMPANY INFO */}
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Company Information
            </h3>

            {company?.uploadLogo && (
              <img
                src={company?.uploadLogo.startsWith("http") ? company?.uploadLogo : `/uploads/${company?.uploadLogo}`}
                alt="Company Logo"
                width="100"
                className="w-32 h-32 object-contain mb-6 border rounded-xl"
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Company Name" value={company?.companyName} />
              <ProfileField label="Company Email" value={company?.contactEmail} />
              <ProfileField label="Phone" value={company?.contactNumber} />
              <ProfileField label="Established Year" value={company?.establishedYear} />
              <ProfileField label="Industry" value={company?.industry} />
              <ProfileField label="Location" value={company?.location} />

              {/* Website */}
              <div>
                <p className="text-gray-500 text-sm">Website</p>
                <a
                  href={company?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-gray-50 rounded-lg border text-blue-600 block break-all"
                >
                  {company?.website || "Not Provided"}
                </a>
              </div>

              {/* Description full width */}
              <div className="col-span-full">
                <ProfileField
                  label="Description"
                  value={company?.description}
                />
              </div>
            </div>
          </>
        )}

        {/* ------------------ CANDIDATE VIEW ------------------ */}
        {role === "candidate" && (
          <>
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">
              Candidate Profile
            </h2>

            <div className="flex items-center gap-6 mb-8">
              <img
                src={user.profileImage || "/default-user.png"}
                alt="Profile"
                className="w-28 h-28 rounded-xl border shadow-sm object-cover"
              />

              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                <p className="font-medium text-gray-900">{user.username}</p>
              </div>
            </div>

            <div className="space-y-6">
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Phone Number" value={user.phone} />
            </div>
          </>
        )}

        {/* ------------------ DEFAULT ------------------ */}
        {role !== "candidate" && role !== "recruiter" && (
          <p className="text-center text-red-500">Not Authorized</p>
        )}
      </div>
    </div>
  );
}

/* ---------- SMALL REUSABLE COMPONENT ---------- */
function ProfileField({ label, value }) {
  return (
    <div className="flex flex-col">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="p-3 bg-gray-50 rounded-lg border text-gray-900">
        {value || "Not Provided"}
      </p>
    </div>
  );
}
