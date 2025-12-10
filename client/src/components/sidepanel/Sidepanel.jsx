import { FiChevronsRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { companyApi } from "../../../api/api";

export default function SidePanel({ role  }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [company, setCompany] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // <-- Sidebar Toggle

  const loggedUser = useSelector((state) => state.auth.user);

  const fetchCompanies = async () => {
    try {
      if (!loggedUser?._id) return;
      const response = await companyApi.get(`/recruiter/${loggedUser._id}`);
      const companies = response?.data?.data || [];
      const recruiterCompany = Array.isArray(companies) ? companies[0] : companies;
      setCompany(recruiterCompany || null);
    } catch (error) {
      console.error("Company fetch error:", error);
      setCompany(null);
    }
  };

  useEffect(() => {
    if (role === "recruiter" && loggedUser?._id) {
      fetchCompanies();
    }
  }, [role, loggedUser?._id]);

  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logoutUser());
      navigate("/login");
    }
  };
  return (
    <>
     {/* Toggle Button (Mobile) */}
<button
  className={`md:hidden fixed  mt-15 p-2.5 rounded-md text-xl z-[1500] 
    bg-gray-800 text-white hover:bg-gray-700 transition-all duration-300
    ${isOpen ? "left-[260px] top-4" : "left-4 top-4"}
  `}
  onClick={() => setIsOpen(!isOpen)}
>
  <FiChevronsRight
    className={`transition-transform duration-300 
        ${isOpen ? "rotate-180 text-white" : "text-red-500"}`}
  />
</button>


      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-[#0f1214] pt-16 
          shadow-[2px_0_10px_rgba(0,0,0,0.5)] z-[1200] transform 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:shadow-none
        `}
      >
        <h3 className="text-white font-semibold text-lg px-6 mb-6">
          {role === "recruiter" ? "Recruiter Panel" : "Candidate Panel"}
        </h3>

        <ul className="flex flex-col px-2 space-y-1 text-gray-300 text-base">
          {role === "recruiter" && (
            <>
              {!company && (
                <li
                  className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                  onClick={() => navigate("/recruiter/company/registration")}
                >
                  Register Company
                </li>
              )}
              {company && (
                <>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate(`/recruiter/home`)}
                  >
                    Home
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate(`/recruiter/company/edit/${company._id}`)}
                  >
                    Edit Company
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate(`/recruiter/company/${company._id}`)}
                  >
                    View Company
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate("/recruiter/company/jobpost")}
                  >
                    Post Jobs
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate("/recruiter/company/postedjobs")}
                  >
                    Posted Jobs
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate("/recruiter/profile")}
                  >
                    Profile
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                    onClick={() => navigate("/recruiter/candidates-list")}
                  >
                    Candidates
                  </li>
                </>
              )}
            </>
          )}

          {role === "candidate" && (
            <>
              <li
                className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                onClick={() => navigate("/candidate/home")}
              >
                Home
              </li>
              <li
                className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                onClick={() => navigate("/candidate/resume")}
              >
                Resume
              </li>
              <li
                className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                onClick={() => navigate("/candidate/create-resume")}
              >
                Create Or Update Resume
              </li>
              <li
                className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                onClick={() => navigate("/candidate/applications/list")}
              >
                Applied Job List
              </li>
              <li
                className="px-6 py-3 hover:bg-[#1b1f23] hover:border-l-4 hover:border-blue-400 cursor-pointer transition"
                onClick={() => navigate("/candidate/Profile")}
              >
                Profile
              </li>
            </>
          )}
        </ul>

        {/* Logout Button */}
        <button
          className="mt-6 mx-2 w-[calc(100%-1.5rem)] py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </aside>
    </>
  );
}
