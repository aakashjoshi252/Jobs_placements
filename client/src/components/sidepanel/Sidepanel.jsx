import { FiChevronsRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { companyApi, resumeApi } from "../../../api/api";
import { setResume } from "../../redux/slices/resumeSlice";
import { setCompany } from "../../redux/slices/companySlice";

export default function SidePanel({ role }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const loggedUser = useSelector((state) => state.auth.user);
  const resume = useSelector((state) => state.resume.data);
  const company = useSelector((state) => state.company.data);

  // Fetch recruiter company
  useEffect(() => {
    if (role !== "recruiter" || !loggedUser?._id) return;
    const fetchCompanies = async () => {
      try {
        const response = await companyApi.get(`/recruiter/${loggedUser._id}`);
        const companies = response?.data?.data || response?.data;
        dispatch(setCompany(companies || null));
      } catch (err) {
        console.error(err);
        dispatch(setCompany(null));
      }
    };
    fetchCompanies();
  }, [loggedUser?._id, role, dispatch]);

  // Fetch candidate resume
  useEffect(() => {
    if (role !== "candidate" || !loggedUser?._id) return;
    const fetchCandidateResume = async () => {
      try {
        const response = await resumeApi.get(`/${loggedUser._id}`);
        const data = response?.data?.data || response?.data;
        dispatch(setResume(data?.[0] || null));
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    fetchCandidateResume();
  }, [loggedUser?._id, role, dispatch]);

  const logoutHandler = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`md:hidden fixed  right-4 z-[1500] p-2.5 rounded-md text-xl bg-gray-800 text-white hover:bg-gray-700 transition-transform duration-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiChevronsRight
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-64 bg-gray-900 pt-16 shadow-lg z-[1200] transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:left-0 md:right-auto md:static md:shadow-none`}
      >
        <h3 className="text-white font-semibold text-lg px-6 mb-6">
          {role === "recruiter" ? "Recruiter Panel" : "Candidate Panel"}
        </h3>

        <ul className="flex flex-col px-2 space-y-2 text-gray-300 text-base">
          {role === "recruiter" && (
            <>
              {!company && (
                <li
                  className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                  onClick={() => navigate("/recruiter/company/registration")}
                >
                  Register Company
                </li>
              )}
              {company && (
                <>
                  <li
                    className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                    onClick={() => navigate("/recruiter/home")}
                  >
                    Home
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                    onClick={() => navigate(`/recruiter/company/${company._id}`)}
                  >
                    View Company
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                    onClick={() => navigate("/recruiter/company/jobpost")}
                  >
                    Post Jobs
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                    onClick={() => navigate("/recruiter/company/postedjobs")}
                  >
                    Posted Jobs
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                    onClick={() => navigate("/recruiter/profile")}
                  >
                    Profile
                  </li>
                  <li
                    className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
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
                className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                onClick={() => navigate("/candidate/home")}
              >
                Home
              </li>
              <li
                className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                onClick={() =>
                  navigate(resume ? "/candidate/resume" : "/candidate/create-resume")
                }
              >
                Resume
              </li>
              <li
                className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                onClick={() => navigate("/candidate/applications/list")}
              >
                Applied Job List
              </li>
              <li
                className="px-6 py-3 hover:bg-gray-800 hover:border-l-4 hover:border-blue-500 cursor-pointer rounded transition"
                onClick={() => navigate("/candidate/profile")}
              >
                Profile
              </li>
            </>
          )}
        </ul>

        {/* Logout Button */}
        <button
          className="mt-6 mx-3 w-[calc(100%-1.5rem)] py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </aside>
    </>
  );
}
