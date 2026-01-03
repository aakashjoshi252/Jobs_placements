# 🚀 Remaining Features Implementation Guide

## Status Update

- ✅ **Feature 1: Resume Form** - COMPLETE
- ✅ **Feature 2: Job Listings with Filters** - COMPLETE  
- ⭕ **Feature 3: Homepage with Jewelry Branding** - Implementation below
- ⭕ **Feature 4: Analytics Dashboard** - Implementation below
- ⭕ **Feature 5: Email Notifications** - Implementation below

---

## 💎 Feature 3: Homepage with Jewelry Branding

### File: `client/src/pages/common/home/Home.jsx`

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../../../api/api';
import { GiJewelCrown, GiDiamondRing, GiCutDiamond, GiGoldBar } from 'react-icons/gi';
import { FaBriefcase, FaUsers, FaBuilding, FaStar } from 'react-icons/fa';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalCandidates: 0,
    featuredJobs: []
  });

  useEffect(() => {
    // Fetch stats
    jobsApi.get('/').then(res => {
      setStats(prev => ({ ...prev, totalJobs: res.data.length }));
    });

    // Fetch featured jobs
    jobsApi.get('/featured').then(res => {
      setStats(prev => ({ ...prev, featuredJobs: res.data.slice(0, 6) }));
    }).catch(() => {
      // Fallback to regular jobs
      jobsApi.get('/').then(res => {
        setStats(prev => ({ ...prev, featuredJobs: res.data.slice(0, 6) }));
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-4">
                <GiJewelCrown className="text-7xl animate-pulse" />
                <GiDiamondRing className="text-6xl animate-bounce" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Gateway to <br />
                <span className="text-yellow-300">Jewelry Industry</span> Careers
              </h1>
              
              <p className="text-xl text-blue-100 mb-8">
                Connect with leading jewelry manufacturers, designers, and retailers.
                Find opportunities in goldsmithing, design, gemology, and more.
              </p>
              
              <div className="flex gap-4 justify-center md:justify-start">
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-yellow-300 hover:text-blue-800 transition shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  💎 Explore Jobs
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition"
                >
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="flex-1 hidden md:block">
              <div className="relative">
                <GiCutDiamond className="text-[300px] text-white/20 animate-spin-slow" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FaBriefcase className="text-5xl text-blue-600" />
              </div>
              <p className="text-4xl font-bold text-gray-800">{stats.totalJobs}+</p>
              <p className="text-gray-600 font-medium">Active Jobs</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FaBuilding className="text-5xl text-purple-600" />
              </div>
              <p className="text-4xl font-bold text-gray-800">150+</p>
              <p className="text-gray-600 font-medium">Jewelry Companies</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <FaUsers className="text-5xl text-green-600" />
              </div>
              <p className="text-4xl font-bold text-gray-800">5000+</p>
              <p className="text-gray-600 font-medium">Job Seekers</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <GiGoldBar className="text-5xl text-yellow-600" />
              </div>
              <p className="text-4xl font-bold text-gray-800">95%</p>
              <p className="text-gray-600 font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            <GiDiamondRing className="inline text-blue-600 mr-3" />
            Explore Jewelry Careers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Jewelry Designer', icon: '✏️', desc: 'Create stunning designs', color: 'blue' },
              { title: 'Goldsmith', icon: '🔨', desc: 'Master craftsmanship', color: 'yellow' },
              { title: 'Gemologist', icon: '🔬', desc: 'Diamond & gem expertise', color: 'purple' },
              { title: 'CAD Designer', icon: '💻', desc: '3D modeling & rendering', color: 'green' },
              { title: 'Sales & Marketing', icon: '📊', desc: 'Drive business growth', color: 'pink' },
              { title: 'Store Manager', icon: '🏪', desc: 'Retail operations', color: 'red' }
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/jobs')}
                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer border-4 border-${cat.color}-200 hover:border-${cat.color}-400 group`}
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition">{cat.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{cat.title}</h3>
                <p className="text-gray-600">{cat.desc}</p>
                <button className="mt-4 text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2">
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            <FaStar className="inline text-yellow-500 mr-3" />
            Featured Opportunities
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.featuredJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/candidate/CompanyAboutCard/${job._id}`)}
                className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition cursor-pointer border-2 border-blue-200 hover:border-blue-400"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    {job.jewelryCategory || 'Featured'}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                <p className="text-gray-700 mb-1">🏪 {job.companyName}</p>
                <p className="text-gray-600 text-sm mb-3">📍 {job.jobLocation}</p>
                
                {job.salary && (
                  <p className="text-green-600 font-bold mb-3">💰 {job.salary}</p>
                )}
                
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                  View Details
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/jobs')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg"
            >
              View All Jobs →
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <GiJewelCrown className="text-7xl mx-auto mb-6 animate-bounce" />
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Jewelry Career?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of professionals in the jewelry industry
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold hover:bg-yellow-300 hover:text-purple-800 transition shadow-xl"
            >
              Register Now
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold hover:bg-white hover:text-purple-600 transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 📊 Feature 4: Analytics Dashboard for Recruiters

### File: `client/src/pages/recruiter/analytics/AnalyticsDashboard.jsx`

Create this new file:

```jsx
import { useEffect, useState } from 'react';
import { jobsApi, applicationApi, companyApi } from '../../../api/api';
import { useSelector } from 'react-redux';
import { FaBriefcase, FaUsers, FaEye, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { GiDiamondRing } from 'react-icons/gi';

export default function AnalyticsDashboard() {
  const loggedUser = useSelector((state) => state.auth.user);
  const recruiterId = loggedUser?._id;

  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    rejectedApplications: 0,
    totalViews: 0,
    recentApplications: [],
    topJobs: [],
    categoryBreakdown: {}
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [recruiterId]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch recruiter's jobs
      const jobsResponse = await jobsApi.get(`/recruiter/${recruiterId}`);
      const jobs = jobsResponse.data || [];

      // Fetch applications
      const appsResponse = await applicationApi.get(`/recruiter/${recruiterId}`);
      const applications = appsResponse.data || [];

      // Calculate stats
      const activeJobs = jobs.filter(j => j.status !== 'closed').length;
      const pending = applications.filter(a => a.status === 'Pending').length;
      const accepted = applications.filter(a => a.status === 'Accepted').length;
      const rejected = applications.filter(a => a.status === 'Rejected').length;

      // Top jobs by applications
      const jobAppCounts = {};
      applications.forEach(app => {
        const jobId = app.jobId?._id || app.jobId;
        jobAppCounts[jobId] = (jobAppCounts[jobId] || 0) + 1;
      });

      const topJobs = jobs
        .map(job => ({
          ...job,
          applicationCount: jobAppCounts[job._id] || 0
        }))
        .sort((a, b) => b.applicationCount - a.applicationCount)
        .slice(0, 5);

      // Category breakdown
      const categoryBreakdown = {};
      jobs.forEach(job => {
        const cat = job.jewelryCategory || 'Other';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
      });

      setAnalytics({
        totalJobs: jobs.length,
        activeJobs,
        totalApplications: applications.length,
        pendingApplications: pending,
        acceptedApplications: accepted,
        rejectedApplications: rejected,
        totalViews: jobs.reduce((sum, j) => sum + (j.views || 0), 0),
        recentApplications: applications.slice(0, 5),
        topJobs,
        categoryBreakdown
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <FaChartLine className="text-blue-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your recruitment performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Jobs</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalJobs}</p>
              </div>
              <FaBriefcase className="text-4xl text-blue-600" />
            </div>
            <p className="text-sm text-green-600 mt-2">↑ {analytics.activeJobs} active</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalApplications}</p>
              </div>
              <FaUsers className="text-4xl text-purple-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">{analytics.pendingApplications} pending</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Accepted</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.acceptedApplications}</p>
              </div>
              <FaCheckCircle className="text-4xl text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {analytics.totalApplications > 0
                ? Math.round((analytics.acceptedApplications / analytics.totalApplications) * 100)
                : 0}% acceptance rate
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{analytics.totalViews}</p>
              </div>
              <FaEye className="text-4xl text-yellow-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Avg: {analytics.totalJobs > 0 ? Math.round(analytics.totalViews / analytics.totalJobs) : 0} per job
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Jobs */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <GiDiamondRing className="text-blue-600" />
              Top Performing Jobs
            </h2>
            <div className="space-y-4">
              {analytics.topJobs.map((job, idx) => (
                <div key={job._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.jewelryCategory}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{job.applicationCount}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Jobs by Category</h2>
            <div className="space-y-4">
              {Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700 font-medium">{category}</span>
                    <span className="text-gray-600 font-semibold">{count} jobs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(count / analytics.totalJobs) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Add Route in `client/src/App.jsx`:

```jsx
import AnalyticsDashboard from './pages/recruiter/analytics/AnalyticsDashboard';

// Add this route
<Route path="/recruiter/analytics" element={<AnalyticsDashboard />} />
```

---

## 📧 Feature 5: Email Notifications

### Backend Setup

#### 1. Install Dependencies

```bash
cd server
npm install nodemailer
```

#### 2. Create Email Service

**File: `server/services/email.service.js`**

```javascript
const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Add to .env
    pass: process.env.EMAIL_PASS  // Add to .env (App Password)
  }
});

// Email templates
const emailTemplates = {
  applicationReceived: (candidateName, jobTitle) => ({
    subject: `Application Received - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">✨ Application Received!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Dear ${candidateName},</p>
          <p style="font-size: 16px; color: #374151;">
            Thank you for applying for the position of <strong>${jobTitle}</strong>.
          </p>
          <p style="font-size: 16px; color: #374151;">
            Your application has been successfully submitted and is under review.
            We'll get back to you soon!
          </p>
          <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #667eea; border-radius: 5px;">
            <p style="margin: 0; color: #6b7280;">Track your application status in your dashboard.</p>
          </div>
          <p style="font-size: 14px; color: #9ca3af;">Best regards,<br/>Jewelry Jobs Team</p>
        </div>
      </div>
    `
  }),

  applicationStatusUpdate: (candidateName, jobTitle, status) => ({
    subject: `Application Update - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">📨 Application Update</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Dear ${candidateName},</p>
          <p style="font-size: 16px; color: #374151;">
            Your application for <strong>${jobTitle}</strong> has been <strong style="color: ${status === 'Accepted' ? '#10b981' : '#ef4444'};">${status}</strong>.
          </p>
          ${status === 'Accepted' ? `
            <div style="margin: 30px 0; padding: 20px; background: #d1fae5; border-left: 4px solid #10b981; border-radius: 5px;">
              <p style="margin: 0; color: #065f46; font-weight: bold;">
                🎉 Congratulations! The recruiter will contact you soon.
              </p>
            </div>
          ` : `
            <div style="margin: 30px 0; padding: 20px; background: #fee2e2; border-left: 4px solid #ef4444; border-radius: 5px;">
              <p style="margin: 0; color: #991b1b;">
                We appreciate your interest. Keep exploring other opportunities!
              </p>
            </div>
          `}
          <p style="font-size: 14px; color: #9ca3af;">Best regards,<br/>Jewelry Jobs Team</p>
        </div>
      </div>
    `
  }),

  newApplication: (recruiterName, candidateName, jobTitle) => ({
    subject: `New Application - ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">👥 New Application Received</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="font-size: 16px; color: #374151;">Dear ${recruiterName},</p>
          <p style="font-size: 16px; color: #374151;">
            <strong>${candidateName}</strong> has applied for the position of <strong>${jobTitle}</strong>.
          </p>
          <div style="margin: 30px 0; padding: 20px; background: white; border-left: 4px solid #667eea; border-radius: 5px;">
            <p style="margin: 0; color: #6b7280;">Review the application in your recruiter dashboard.</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/recruiter/applications" 
             style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Review Application
          </a>
          <p style="font-size: 14px; color: #9ca3af; margin-top: 30px;">Best regards,<br/>Jewelry Jobs Team</p>
        </div>
      </div>
    `
  })
};

class EmailService {
  async sendEmail(to, template, ...args) {
    try {
      const { subject, html } = emailTemplates[template](...args);
      
      const info = await transporter.sendMail({
        from: `"Jewelry Jobs" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
      });

      console.log('✅ Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Convenience methods
  async notifyApplicationReceived(candidateEmail, candidateName, jobTitle) {
    return this.sendEmail(candidateEmail, 'applicationReceived', candidateName, jobTitle);
  }

  async notifyApplicationStatus(candidateEmail, candidateName, jobTitle, status) {
    return this.sendEmail(candidateEmail, 'applicationStatusUpdate', candidateName, jobTitle, status);
  }

  async notifyNewApplication(recruiterEmail, recruiterName, candidateName, jobTitle) {
    return this.sendEmail(recruiterEmail, 'newApplication', recruiterName, candidateName, jobTitle);
  }
}

module.exports = new EmailService();
```

#### 3. Update `.env` File

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password  # Generate from Google Account Settings
FRONTEND_URL=http://localhost:5173
```

**How to get Gmail App Password:**
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App Passwords
4. Generate new app password
5. Copy and paste to `.env`

#### 4. Update Application Controller

**File: `server/controllers/application.controller.js`**

Add email notifications:

```javascript
const emailService = require('../services/email.service');

// In createApplication function:
const createApplication = async (req, res) => {
  try {
    // ... existing code ...

    const savedApplication = await newApplication.save();

    // ✨ SEND EMAILS
    // To candidate
    await emailService.notifyApplicationReceived(
      candidate.email,
      candidate.username,
      job.title
    );

    // To recruiter
    await emailService.notifyNewApplication(
      recruiter.email,
      recruiter.username,
      candidate.username,
      job.title
    );

    res.status(201).json({
      message: 'Application submitted successfully! Check your email.',
      application: savedApplication
    });
  } catch (error) {
    // ... error handling ...
  }
};

// In updateApplicationStatus function:
const updateApplicationStatus = async (req, res) => {
  try {
    // ... existing code ...

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('candidateId');

    // ✨ SEND EMAIL TO CANDIDATE
    await emailService.notifyApplicationStatus(
      updatedApplication.candidateId.email,
      updatedApplication.candidateId.username,
      updatedApplication.jobId.title,
      status
    );

    res.status(200).json({
      message: `Application ${status}. Email sent to candidate.`,
      application: updatedApplication
    });
  } catch (error) {
    // ... error handling ...
  }
};
```

---

## 🛠️ Installation & Testing

### For Features 3-5:

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install email dependencies (Feature 5)
cd server
npm install nodemailer

# 3. Update .env with email credentials
# Add EMAIL_USER and EMAIL_PASS

# 4. Restart both servers
cd server && npm run dev
cd client && npm run dev

# 5. Test features:
# - Visit / for new homepage
# - Visit /recruiter/analytics for dashboard
# - Apply for a job to test emails
```

---

## ✅ Feature Checklist

- [x] **Resume Form** - Jewelry fields, certifications, portfolio
- [x] **Job Listings** - Advanced filters, jewelry categories
- [ ] **Homepage** - Jewelry branding (code provided above)
- [ ] **Analytics** - Recruiter dashboard (code provided above)
- [ ] **Email Notifications** - Application alerts (code provided above)

---

## 📝 Implementation Steps

### Step 1: Homepage (5 minutes)
1. Replace content in `client/src/pages/common/home/Home.jsx`
2. Test at `/`

### Step 2: Analytics (10 minutes)
1. Create `client/src/pages/recruiter/analytics/` folder
2. Create `AnalyticsDashboard.jsx` file
3. Add route to `App.jsx`
4. Add link to recruiter sidebar
5. Test at `/recruiter/analytics`

### Step 3: Email Notifications (15 minutes)
1. Install nodemailer: `npm install nodemailer`
2. Create `server/services/email.service.js`
3. Update `.env` with email credentials
4. Update `server/controllers/application.controller.js`
5. Test by applying for a job

---

## 🐛 Troubleshooting

### Email Not Sending?

**Check:**
1. Gmail App Password (not regular password)
2. 2-Step Verification enabled
3. .env variables loaded
4. No typos in email addresses
5. Server console for email errors

**Test Email Manually:**
```javascript
// In server console
const emailService = require('./services/email.service');
emailService.sendEmail('test@example.com', 'applicationReceived', 'Test User', 'Test Job');
```

### Analytics Not Loading?

**Check:**
1. Route added to App.jsx
2. User logged in as recruiter
3. Recruiter has posted jobs
4. Console for API errors

---

**Need help implementing? Let me know which feature to start with!** 🚀
