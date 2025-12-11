  import { useEffect, useState } from "react";
  import { useSelector } from "react-redux";

  export default function RecruiterDashboard() {
    const [recruiter, setRecruiter] = useState(null);
    const loggedUser = useSelector((state) => state.auth.user);

    useEffect(() => {
      if (loggedUser?.role === "recruiter") {
        setRecruiter(loggedUser);
      }
    }, [loggedUser]);

    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Recruiter Dashboard</h2>

        {recruiter && (
          <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 max-w-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Welcome, {recruiter.name || recruiter.email}
            </h3>
          </div>
        )}
      </div>
    );
  }
