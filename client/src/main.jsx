import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/components.css'
import './styles/animations.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { SocketProvider } from "./context/SocketContext.jsx";

// Loading Component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium text-lg">Loading...</p>
    </div>
  </div>
);

// Lazy Loading Pages
const Layout = lazy(() => import('./layout/Layout.jsx'));
const Home = lazy(() => import('./pages/common/home/Home.jsx'));
const AboutLazy = lazy(() => import('./pages/common/about/About.jsx'));
const ContactLazy = lazy(() => import('./pages/common/contact/Contact.jsx'));
const PageNotFound = lazy(() => import('./pages/common/page404/Page404.jsx'));
const NotificationsPage = lazy(() => import('./pages/common/notifications/NotificationsPage.jsx'));
const Login = lazy(() => import('./auth/login/Login.jsx'));
const Register = lazy(() => import('./auth/register/Register.jsx'));
const Resume = lazy(() => import('./pages/candidates/resume/Resume.jsx'));
const CompanyView = lazy(() => import('./pages/recruiter/company/Company.jsx'));
const CompanyRegistration = lazy(() => import('./pages/recruiter/compRegis/CompRegis.jsx'));
const JobPost = lazy(() => import('./pages/recruiter/jobPost/JobPost.jsx'));
const PostedJobs = lazy(() => import('./pages/recruiter/postedjobs/PostedJobs.jsx'));
const EditJob = lazy(() => import('./pages/recruiter/postedjobs/editJobs/EditJob.jsx'));
const Profile = lazy(() => import('./pages/common/profile/Profile.jsx'));
const EditProfile = lazy(() => import("./pages/common/profile/edit/EditProfile.jsx"));
const CompanyAboutCard = lazy(() => import('./pages/candidates/jobs/companyDetails/CompanyCard.jsx'));
const Recruiterhome = lazy(() => import('./pages/recruiter/Home.jsx'));
const Employeehome = lazy(() => import('./pages/candidates/Home.jsx'));
const CreateResume = lazy(() => import('./pages/candidates/resume/create/CreateResume.jsx'));
const EditResume = lazy(() => import('./pages/candidates/resume/create/EditResume.jsx'));
const FAQ = lazy(() => import('./pages/common/faq/FAQ.jsx'));
const PrivacyPolicy = lazy(() => import('./pages/common/privecy&policiy/PrivacyPolicy.jsx'));
const EnhancedBlogList = lazy(() => import('./pages/common/blogs/EnhancedBlogList.jsx'));
const BlogDetails = lazy(() => import('./pages/common/blogs/BlogDetails.jsx'));
const Jobs = lazy(() => import('./pages/candidates/jobs/Jobs.jsx'));
const JobApply = lazy(() => import('./pages/candidates/applyjobs/JobApply.jsx'));
const AppliedJobs = lazy(() => import('./pages/candidates/applyjobs/appliedJobs/AppliedJobList.jsx'));
const CandidatesList = lazy(() => import('./pages/recruiter/candidates-list/Candidates.jsx'));
const CandidatesView = lazy(() => import('./pages/recruiter/candidates-list/cadidatedata/CandidateOverview.jsx'));
const CompanyEdit = lazy(() => import('./pages/recruiter/company/edit/EditCompnay.jsx'));
const CandidateProfile = lazy(() => import('./pages/recruiter/candidates-list/cadidatedata/CadidatesData.jsx'));
const ChatPage = lazy(() => import('./pages/common/chatpage/Chatpage.jsx'));

// Company Blog Components - NEW
const CompanyBlogList = lazy(() => import('./pages/recruiter/blogs/CompanyBlogList.jsx'));
const CreateBlog = lazy(() => import('./pages/recruiter/blogs/CreateBlog.jsx'));
const EditBlog = lazy(() => import('./pages/recruiter/blogs/EditBlog.jsx'));

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<LoadingFallback />}><Layout /></Suspense>,
    children: [
      {
        index: true,
        element: <Suspense fallback={<LoadingFallback />}><Home /></Suspense>
      },
      {
        path: "about",
        element: <Suspense fallback={<LoadingFallback />}><AboutLazy /></Suspense>
      },
      {
        path: "contact",
        element: <Suspense fallback={<LoadingFallback />}><ContactLazy /></Suspense>
      },
      {
        path: "login",
        element: <Suspense fallback={<LoadingFallback />}><Login /></Suspense>
      },
      {
        path: "register",
        element: <Suspense fallback={<LoadingFallback />}><Register /></Suspense>
      },
      {
        path: "login/register",
        element: <Suspense fallback={<LoadingFallback />}><Register /></Suspense>
      },

      // ========== COMMON ROUTES ==========
      {
        path: "chat",
        element: <Suspense fallback={<LoadingFallback />}><ChatPage /></Suspense>
      },
      {
        path: "messages",
        element: <Suspense fallback={<LoadingFallback />}><ChatPage /></Suspense>
      },
      {
        path: "notification",
        element: <Suspense fallback={<LoadingFallback />}><NotificationsPage /></Suspense>
      },
      {
        path: "notifications",
        element: <Suspense fallback={<LoadingFallback />}><NotificationsPage /></Suspense>
      },
      {
        path: "profile",
        element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>
      },
      {
        path: "profile/edit/:userId",
        element: <Suspense fallback={<LoadingFallback />}><EditProfile /></Suspense>
      },

      // ========== RECRUITER ROUTES ==========
      {
        path: "recruiter/home",
        element: <Suspense fallback={<LoadingFallback />}><Recruiterhome /></Suspense>
      },
      {
        path: "recruiter/dashboard",
        element: <Suspense fallback={<LoadingFallback />}><Recruiterhome /></Suspense>
      },
      {
        path: "recruiter/company/:id",
        element: <Suspense fallback={<LoadingFallback />}><CompanyView /></Suspense>
      },
      {
        path: "recruiter/company/edit/:id",
        element: <Suspense fallback={<LoadingFallback />}><CompanyEdit /></Suspense>
      },
      {
        path: "recruiter/company/registration",
        element: <Suspense fallback={<LoadingFallback />}><CompanyRegistration /></Suspense>
      },
      {
        path: "recruiter/profile",
        element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>
      },
      {
        path: "recruiter/profile/edit/:userId",
        element: <Suspense fallback={<LoadingFallback />}><EditProfile /></Suspense>
      },
      {
        path: "recruiter/company/jobpost",
        element: <Suspense fallback={<LoadingFallback />}><JobPost /></Suspense>
      },
      {
        path: "recruiter/jobpost",
        element: <Suspense fallback={<LoadingFallback />}><JobPost /></Suspense>
      },
      {
        path: "recruiter/company/postedjobs",
        element: <Suspense fallback={<LoadingFallback />}><PostedJobs /></Suspense>
      },
      {
        path: "recruiter/postedjobs",
        element: <Suspense fallback={<LoadingFallback />}><PostedJobs /></Suspense>
      },
      {
        path: "recruiter/jobs",
        element: <Suspense fallback={<LoadingFallback />}><PostedJobs /></Suspense>
      },
      {
        path: "recruiter/company/postedjobs/edit/:jobId",
        element: <Suspense fallback={<LoadingFallback />}><EditJob /></Suspense>
      },
      {
        path: "recruiter/postedjobs/edit/:jobId",
        element: <Suspense fallback={<LoadingFallback />}><EditJob /></Suspense>
      },
      {
        path: "recruiter/candidates-list",
        element: <Suspense fallback={<LoadingFallback />}><CandidatesList /></Suspense>
      },
      {
        path: "recruiter/applications",
        element: <Suspense fallback={<LoadingFallback />}><CandidatesList /></Suspense>
      },
      {
        path: "recruiter/candidates-list/:applicationId",
        element: <Suspense fallback={<LoadingFallback />}><CandidatesView /></Suspense>
      },
      {
        path: "recruiter/candidates-list/candidate/:applicationId",
        element: <Suspense fallback={<LoadingFallback />}><CandidateProfile /></Suspense>
      },
      {
        path: "recruiter/chat",
        element: <Suspense fallback={<LoadingFallback />}><ChatPage /></Suspense>
      },
      {
        path: "recruiter/messages",
        element: <Suspense fallback={<LoadingFallback />}><ChatPage /></Suspense>
      },
      {
        path: "recruiter/notifications",
        element: <Suspense fallback={<LoadingFallback />}><NotificationsPage /></Suspense>
      },
      // Company Blog Routes - NEW
      {
        path: "recruiter/blogs",
        element: <Suspense fallback={<LoadingFallback />}><CompanyBlogList /></Suspense>
      },
      {
        path: "recruiter/blogs/create",
        element: <Suspense fallback={<LoadingFallback />}><CreateBlog /></Suspense>
      },
      {
        path: "recruiter/blogs/edit/:blogId",
        element: <Suspense fallback={<LoadingFallback />}><EditBlog /></Suspense>
      },

      // ========== CANDIDATE ROUTES ==========
      {
        path: "candidate/home",
        element: <Suspense fallback={<LoadingFallback />}><Employeehome /></Suspense>
      },
      {
        path: "candidate/dashboard",
        element: <Suspense fallback={<LoadingFallback />}><Employeehome /></Suspense>
      },
      {
        path: "candidate/profile",
        element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense>
      },
      {
        path: "candidate/profile/edit/:userId",
        element: <Suspense fallback={<LoadingFallback />}><EditProfile /></Suspense>
      },
      {
        path: "candidate/resume",
        element: <Suspense fallback={<LoadingFallback />}><Resume /></Suspense>
      },
      {
        path: "candidate/create-resume",
        element: <Suspense fallback={<LoadingFallback />}><CreateResume /></Suspense>
      },
      {
        path: "candidate/edit-resume",
        element: <Suspense fallback={<LoadingFallback />}><EditResume /></Suspense>
      },
      {
        path: "candidate/jobs",
        element: <Suspense fallback={<LoadingFallback />}><Jobs /></Suspense>
      },
      {
        path: "candidate/CompanyAboutCard/:jobId",
        element: <Suspense fallback={<LoadingFallback />}><CompanyAboutCard /></Suspense>
      },
      {
        path: "candidate/job/:jobId",
        element: <Suspense fallback={<LoadingFallback />}><CompanyAboutCard /></Suspense>
      },
      {
        path: "candidate/CompanyAboutCard/jobs/apply",
        element: <Suspense fallback={<LoadingFallback />}><JobApply /></Suspense>
      },
      {
        path: "candidate/job/apply",
        element: <Suspense fallback={<LoadingFallback />}><JobApply /></Suspense>
      },
      {
        path: "candidate/applications/list",
        element: <Suspense fallback={<LoadingFallback />}><AppliedJobs /></Suspense>
      },
      {
        path: "candidate/appliedJobs",
        element: <Suspense fallback={<LoadingFallback />}><AppliedJobs /></Suspense>
      },
      {
        path: "candidate/applications",
        element: <Suspense fallback={<LoadingFallback />}><AppliedJobs /></Suspense>
      },
      {
        path: "candidate/chat",
        element: <Suspense fallback={<LoadingFallback />}><ChatPage /></Suspense>
      },
      {
        path: "candidate/messages",
        element: <Suspense fallback={<LoadingFallback />}><ChatPage /></Suspense>
      },
      {
        path: "candidate/notifications",
        element: <Suspense fallback={<LoadingFallback />}><NotificationsPage /></Suspense>
      },

      // ========== PUBLIC PAGES ==========
      {
        path: "jobs",
        element: <Suspense fallback={<LoadingFallback />}><Jobs /></Suspense>
      },
      {
        path: "blogs",
        element: <Suspense fallback={<LoadingFallback />}><EnhancedBlogList /></Suspense>
      },
      {
        path: "company-stories",
        element: <Suspense fallback={<LoadingFallback />}><EnhancedBlogList /></Suspense>
      },
      {
        path: "blogs/:id",
        element: <Suspense fallback={<LoadingFallback />}><BlogDetails /></Suspense>
      },
      {
        path: "privacy-policy",
        element: <Suspense fallback={<LoadingFallback />}><PrivacyPolicy /></Suspense>
      },
      {
        path: "faq",
        element: <Suspense fallback={<LoadingFallback />}><FAQ /></Suspense>
      },
      {
        path: "*",
        element: <Suspense fallback={<LoadingFallback />}><PageNotFound /></Suspense>
      }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SocketProvider>
      <RouterProvider router={routes} />
    </SocketProvider>
  </Provider>
);
