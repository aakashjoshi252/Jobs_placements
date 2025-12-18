import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  const resume = useSelector((state) => state.resume.data);
  const company = useSelector((state) => state.company.data);
  const userId=user._id
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(false);
  }, [user, company]);

  if (!user || loading) {
    return (
      <div className="text-center mt-10 text-gray-600">
        Loading...
      </div>
    );
  }

  const role = user.role;

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 relative">

        {/* EDIT PROFILE BUTTON */}
        <button
          onClick={() =>
            navigate(
              role === "recruiter"
                ? `/recruiter/profile/edit/profile/${userId}`
                : `/candidate/profile/edit/profile/${userId}`
            )
          }
          className="absolute top-6 right-6 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Edit Profile
        </button>

        {/* ------------------ RECRUITER VIEW ------------------ */}
        {role === "recruiter" && (
          <>
            <h2 className="text-3xl font-semibold mb-8 text-gray-800">
              Recruiter Profile
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Name" value={user.username} />
              <ProfileField label="Email" value={user.email} />
              <ProfileField label="Phone" value={user.phone} />
              <ProfileField label="Password" value="🔒 Hidden for Security" />
            </div>

            <hr className="my-10" />

            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Company Information
            </h3>

            {!company ? (
              <p className="text-red-500">
                Company not found. Please register.
              </p>
            ) : (
              <>
                {company.uploadLogo && (
                  <img
                    src={
                      company.uploadLogo.startsWith("http")
                        ? company.uploadLogo
                        : `/uploads/${company.uploadLogo}`
                    }
                    alt="Company Logo"
                    className="w-32 h-32 object-contain mb-6 border rounded-xl"
                  />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField label="Company Name" value={company.companyName} />
                  <ProfileField label="Company Email" value={company.contactEmail} />
                  <ProfileField label="Phone" value={company.contactNumber} />
                  <ProfileField label="Established Year" value={company.establishedYear} />
                  <ProfileField label="Industry" value={company.industry} />
                  <ProfileField label="Location" value={company.location} />

                  <div>
                    <p className="text-gray-500 text-sm">Website</p>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-gray-50 rounded-lg border text-blue-600 block break-all"
                    >
                      {company.website || "Not Provided"}
                    </a>
                  </div>

                  <div className="col-span-full">
                    <ProfileField
                      label="Description"
                      value={company.description}
                    />
                  </div>
                </div>
              </>
            )}
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
                <p className="font-medium text-gray-900">
                  {user.username}
                </p>
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
          <p className="text-center text-red-500">
            Not Authorized
          </p>
        )}
      </div>
    </div>
  );
}

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
