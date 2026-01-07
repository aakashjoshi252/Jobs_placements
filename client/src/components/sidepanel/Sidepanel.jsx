import { FiChevronsRight } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { companyApi, resumeApi } from "../../api/api";
import { setResume } from "../../redux/slices/resumeSlice";
import { setCompany } from "../../redux/slices/companySlice";
import {
  HiHome,
  HiOfficeBuilding,
  HiBriefcase,
  HiDocumentText,
  HiUser,
  HiUserGroup,
  HiNewspaper,
  HiCog,
  HiLogout,
  HiClipboardList,
  HiPencilAlt
} from "react-icons/hi";

export default function SidePanel({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const loggedUser = useSelector((state) => state.auth.user);
  const resume = useSelector((state) => state.resume.data);
  const company = useSelector((state) => state.company.data);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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

  const isActive = (path) => location.pathname.includes(path);

  const MenuItem = ({ icon, label, onClick, path }) => {
    const active = path && isActive(path);
    return (
      <li
        className={`px-6 py-3 cursor-pointer rounded-lg transition-all flex items-center gap-3 group ${
          active
            ? "bg-gradient-navy-teal border-l-4 border-teal-400 text-white shadow-navy"
            : "hover:bg-navy-700 hover:border-l-4 hover:border-teal-500 text-navy-100 hover:text-white"
        }`}
        onClick={onClick}
      >
        <span className="text-xl">{icon}</span>
        <span className="font-medium">{label}</span>
      </li>
    );
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className={`md:hidden fixed right-4 top-20 z-[1500] p-3 rounded-lg shadow-navy-lg bg-navy-600 text-white hover:bg-navy-700 transition-all ${
          isOpen ? "rotate-180" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        <FiChevronsRight className="text-xl transition-transform duration-300" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-navy-950 bg-opacity-60 z-[1100]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-screen w-72 bg-navy-900 pt-20 shadow-navy-lg z-[1200] transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${isOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0 md:left-0 md:right-auto md:static md:shadow-none md:w-64`}
      >
        {/* Panel Header */}
        <div className="px-6 mb-6">
          <h3 className="text-white font-bold text-xl mb-1">
            {role === "recruiter" ? "Recruiter Panel" : "Candidate Panel"}
          </h3>
          <p className="text-teal-300 text-sm">
            {role === "recruiter" ? "Manage your company" : "Find your dream job"}
          </p>
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex flex-col px-2 space-y-1">
            {role === "recruiter" && (
              <>
                {!company ? (
                  <MenuItem
                    icon={<HiOfficeBuilding />}
                    label="Register Company"
                    onClick={() => navigate("/recruiter/company/registration")}
                    path="/recruiter/company/registration"
                  />
                ) : (
                  <>
                    <MenuItem
                      icon={<HiHome />}
                      label="Dashboard"
                      onClick={() => navigate("/recruiter/home")}
                      path="/recruiter/home"
                    />
                    <MenuItem
                      icon={<HiOfficeBuilding />}
                      label="Company Profile"
                      onClick={() => navigate(`/recruiter/company/${company._id}`)}
                      path="/recruiter/company"
                    />
                    <MenuItem
                      icon={<HiPencilAlt />}
                      label="Post Job"
                      onClick={() => navigate("/recruiter/jobpost")}
                      path="/recruiter/jobpost"
                    />
                    <MenuItem
                      icon={<HiBriefcase />}
                      label="Posted Jobs"
                      onClick={() => navigate("/recruiter/postedjobs")}
                      path="/recruiter/postedjobs"
                    />
                    <MenuItem
                      icon={<HiUserGroup />}
                      label="Applications"
                      onClick={() => navigate("/recruiter/candidates-list")}
                      path="/recruiter/candidates-list"
                    />
                    <MenuItem
                      icon={<HiNewspaper />}
                      label="Company Blogs"
                      onClick={() => navigate("/recruiter/blogs")}
                      path="/recruiter/blogs"
                    />
                    <MenuItem
                      icon={<HiUser />}
                      label="Profile"
                      onClick={() => navigate("/recruiter/profile")}
                      path="/recruiter/profile"
                    />
                  </>
                )}
              </>
            )}

            {role === "candidate" && (
              <>
                <MenuItem
                  icon={<HiHome />}
                  label="Dashboard"
                  onClick={() => navigate("/candidate/home")}
                  path="/candidate/home"
                />
                <MenuItem
                  icon={<HiDocumentText />}
                  label={resume ? "My Resume" : "Create Resume"}
                  onClick={() =>
                    navigate(resume ? "/candidate/resume" : "/candidate/create-resume")
                  }
                  path="/candidate/resume"
                />
                <MenuItem
                  icon={<HiBriefcase />}
                  label="Find Jobs"
                  onClick={() => navigate("/candidate/jobs")}
                  path="/candidate/jobs"
                />
                <MenuItem
                  icon={<HiClipboardList />}
                  label="My Applications"
                  onClick={() => navigate("/candidate/applications")}
                  path="/candidate/applications"
                />
                <MenuItem
                  icon={<HiUser />}
                  label="Profile"
                  onClick={() => navigate("/candidate/profile")}
                  path="/candidate/profile"
                />
              </>
            )}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-navy-950 border-t border-navy-700">
          <button
            className="w-full px-6 py-3 mb-2 text-navy-100 hover:bg-navy-800 rounded-lg transition flex items-center gap-3 font-medium hover:text-white"
            onClick={() => navigate("/settings")}
          >
            <HiCog className="text-xl" />
            Settings
          </button>
          <button
            className="w-full py-3 bg-gradient-coral text-white rounded-lg hover:shadow-coral transition-all flex items-center justify-center gap-2 font-semibold shadow-lg hover:scale-105"
            onClick={logoutHandler}
          >
            <HiLogout className="text-xl" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
