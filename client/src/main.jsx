import { createRoot } from 'react-dom/client';
import './index.css';
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
const BlogList = lazy(() => import('./pages/common/blogs/BlogList.jsx'));
const BlogDetails = lazy(() => import('./pages/common/blogs/BlogDetails.jsx'));
const Jobs = lazy(() => import('./pages/candidates/jobs/Jobs.jsx'));
const JobApply = lazy(() => import('./pages/candidates/applyjobs/JobApply.jsx'));
const AppliedJobs = lazy(() => import('./pages/candidates/applyjobs/appliedJobs/AppliedJobList.jsx'));
const CandidatesList = lazy(() => import('./pages/recruiter/candidates-list/Candidates.jsx'));
const CandidatesView = lazy(() => import('./pages/recruiter/candidates-list/cadidatedata/CandidateOverview.jsx'));
const CompanyEdit = lazy(() => import('./pages/recruiter/company/edit/EditCompnay.jsx'));
const CandidateProfile = lazy(() => import('./pages/recruiter/candidates-list/cadidatedata/CadidatesData.jsx'));

// Chat Components
const ChatPage = lazy(() => import('./pages/common/chatpage/Chatpage.jsx'));

const blogsData = [
  {
    _id: "101",
    title: "Top 10 Interview Tips to Get Your Dream Job",
    description: "A successful interview needs confidence and preparation. Learn techniques to leave a lasting impression on recruiters.",
    content: "Interviews are not just about knowledge but also how well you present yourself. Research the company, understand the job role, practice common interview questions, and arrive on time. Dress professionally and maintain eye contact. Highlight your achievements with real examples. Ask meaningful questions about the role and the company. Lastly, always follow up with a thank-you message.",
    image: "https://images.unsplash.com/photo-1551836022-4c4c79ecde25",
    date: "2025-01-09"
  },
  {
    _id: "102",
    title: "How to Write a Professional Resume That Stands Out",
    description: "Your resume is your first impression to employers. Learn the best format, keywords, and tips to get shortlisted.",
    content: "A standout resume must be clear, concise, and ATS-friendly. Focus on accomplishments instead of job duties. Use bullet points and strong action verbs like managed, developed, and implemented. Tailor your resume to each job role and include measurable results. Keep the design clean and avoid unnecessary images or colors.",
    image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d",
    date: "2025-01-15"
  },
  {
    _id: "103",
    title: "Career Switch Guide: How to Transition Into IT",
    description: "IT careers offer great salaries and growth. Discover how freshers and non-tech candidates can start in IT.",
    content: "To transition into IT, start by learning skills through online courses and internships. Build projects to show practical knowledge. Network with IT professionals on LinkedIn and attend workshops or hackathons. Focus on roles like Frontend Developer, QA Tester, Technical Support, or Cloud Associate as entry points.",
    image: "https://images.unsplash.com/photo-1537432376769-00a4c3891827",
    date: "2025-01-20"
  },
  {
    _id: "104",
    title: "LinkedIn Optimization: Get Noticed by Recruiters",
    description: "A powerful LinkedIn profile increases job visibility. Learn how to enhance your personal branding.",
    content: "Update your profile headline, add a professional profile image, and include relevant skills endorsed by peers. Post frequently about your projects, certifications, or achievements. Join professional groups and follow companies you're targeting. Write a strong about section that highlights your career goals and expertise.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    date: "2025-02-01"
  },
  {
    _id: "105",
    title: "Top 8 Soft Skills Employers Want in 2025",
    description: "Technical skills are important — but soft skills are what make you a leader in the workplace.",
    content: "Soft skills like communication, teamwork, adaptability, problem-solving, leadership, creativity, emotional intelligence, and time management are increasingly in demand. Work on developing these skills through group tasks, real projects, and mentorship.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    date: "2025-02-11"
  },
  {
    _id: "106",
    title: "Work From Home Jobs: Beginners Guide",
    description: "Looking to start your career remotely? Explore trending WFH job roles and required skills.",
    content: "Work-from-home roles include Data Entry, Customer Support, Virtual Assistant, Content Writer, and Digital Marketing Associate. Make sure you have a professional home setup, a reliable internet connection, and communication skills. Build trust through timely delivery and transparency.",
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28",
    date: "2025-02-18"
  }
];

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

      // ========== COMMON ROUTES (Both Recruiter & Candidate) ==========
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
        element: <Suspense fallback={<LoadingFallback />}><BlogList /></Suspense>
      },
      {
        path: "blogs/:id",
        element: <Suspense fallback={<LoadingFallback />}><BlogDetails blogs={blogsData} /></Suspense>
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
