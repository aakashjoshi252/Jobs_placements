# Placement Website & App – Full Stack Development Guide

## MERN Stack Implementation

---

## 1. Project Vision & Objectives

### Vision Statement
- **Guaranteed Safety and Security** for all platform users (employers, employees, and administrators)
- Create a centralized digital marketplace connecting job seekers with placement opportunities
- Streamline hiring, attendance, and payment processes in the jewelry/stones industry

---

## 2. Technology Stack Requirements

### Platform Architecture
- **One Website** (React-based web application)
- **One Mobile App** (React Native or React-based PWA)
- **Backend API** (Express.js with Node.js)
- **Database** (MongoDB for user data, job posts, billing)
- **Admin Panel** (Separate React dashboard for RKCS administrators)

### Core Panels
1. **Admin Panel** – For RKC management team
2. **Employer Panel** – For company/contractor profiles
3. **Employee Panel** – For labor/job seeker profiles

---

## 3. Employer Panel Functionalities

### 3.1 Registration & Profile Management
- Company registration with GST number and PAN
- Valid identity proofs (Aadhar + PAN creates unique employer ID)
- **Important Rule**: One Aadhar card + One PAN card = Only 1 employer ID allowed
- Company details storage (name, address, contact, banking info)

### 3.2 Job Posting
- Create job postings with labor requirements
- Specify role types: Filler, Polisher, Micro Setter, etc.
- Define rate structures:
  - **Fixed Rate**: Bill on 10% of gross salary (one-time)
  - **Contract Rate**: Per hour or per stone
    - *Per Hour*: Specify hourly rate
    - *Per Stone*: Specify rate per individual stone/setting type

### 3.3 Employee Approval & Rejection
- View applications from interested employees
- Approve suitable candidates (auto-notification sent to employee + employer dashboard update)
- Reject unsuitable candidates with feedback
- Maintain approved employee list in employer profile

### 3.4 Gatepass Management
- Generate gatepass links for approved employees
- Send gatepass via SMS/message to employees
- Track gatepass usage and worksite attendance

### 3.5 Wage Calculation & Billing
- View all assigned employees with wage details
- Calculate wages by billing cycle:
  - Per Day
  - Per Week
  - Per Month
- Create hisab (accounting record) before the 7th of each month
- Export hisab as PDF or Excel format
- Send to RKC for confirmation with employee names and codes
- Receive final invoice from RKC

### 3.6 Available Labor Directory
- Browse all open/available labor on platform
- Filter by position type (filler, polisher, micro, etc.)
- Direct messaging to interested candidates
- View candidate profiles and skill specializations

---

## 4. Employee Panel Functionalities

### 4.1 Registration & Profile
- Employee registration with:
  - Valid identity proof
  - Permanent address proof
  - Residential address proof
  - Bank account details (for payment)
- **Important Rule**: One Aadhar + One PAN = One employee ID only

### 4.2 Skill Categorization
- Employees declare their specialization:
  - Filler
  - Polisher
  - Micro Setter
  - Other stone-setting roles

### 4.3 Job Discovery & Application
- View all open vacancies matching their skill type
- Filter vacancies by:
  - Position type
  - Rate/compensation
  - Contract vs Fixed basis
  - Employer details
- Apply to suitable positions
- Track application status

### 4.4 Communication
- Contact employers via call/message directly
- Receive gatepass links from approved employers
- View approved job details in profile
- Receive notifications when approved for positions

### 4.5 Rate Information
- View employer-provided wage rates (visible only to RKC and employee)
- Understand billing cycles and payment schedules
- Track earnings history

---

## 5. Admin Panel (RKCS Management)

### 5.1 User Management
- Monitor all employer and employee registrations
- Verify identity documents and banking details
- Assign unique RKCS ID codes to all users/companies
- Track RKCS identification numbers for future reference

### 5.2 Vacancy & Approval Oversight
- Review employer-submitted job posts
- Approve/reject vacancies based on guidelines
- Monitor employer-employee matching process
- Auto-generate reports when approval occurs

### 5.3 Attendance & Inspection
- Access RKC attendance software/machines integration
- Track worksite attendance records
- RKC personnel visit/contact employers for verification
- Maintain attendance logs linked to employee IDs

### 5.4 Commission Management
- Calculate RKCS commissions automatically:
  - **Setter**: ₹0.10 per stone (round setting), ₹0.20 per stone (fancy setting)
  - **Filler/Polisher**: ₹7.00 per hour
- Generate commission reports
- Track earnings by engagement type

### 5.5 Accounting & Reporting
- Receive wage hisabs from employers (PDF/Excel format)
- Verify employee names and RKCS codes
- Generate accounting reports for every employer-employee engagement
- Send final invoices to employers
- Maintain audit trail of all transactions

### 5.6 Code Generation & Tracking
- Auto-generate unique RKCS codes for:
  - Each employer/company
  - Each employee/labor
- Use codes for attendance machine integration
- Enable quick identification and reporting

---

## 6. Marketing & Outreach Strategy

### 6.1 Contractor Engagement
- Contact major contractors to list requirements:
  - Shaileshbhai
  - Rana
  - MJ Placement
  - Ideal Placement
  - Other established placement agencies

### 6.2 HR & SEEPZ Engagement
- Reach out to HR departments in SEEPZ (Special Economic Zone)
- Partner with zone contractors for requirement postings
- Build B2B relationships

### 6.3 Offline Marketing
- Print and distribute banners in key locations:
  - SEEPZ area
  - Zaveri Bazar (jewelry marketplace)
  - Paperbox market
  - Industrial areas
- Create awareness through local presence

---

## 7. Commission Structure

### 7.1 RKCS Earnings

| Role Category | Rate Type | Rate Amount | Unit |
|---|---|---|---|
| Setter (Round) | Per Stone | ₹0.10 | paisa |
| Setter (Fancy) | Per Stone | ₹0.20 | paisa |
| Filler/Polisher | Per Hour | ₹7.00 | hour |

**Note**: Rates are calculated on employer-mentioned post rates at vacancy creation time.

---

## 8. Wage Calculation Example

\begin{table}
\begin{tabular}{|l|l|r|r|r|}
\hline
Position & Basis & Rate & Quantity & Total \\
\hline
Filler & Hourly & ₹7/hr & 100 hrs & ₹700 \\
Setter (Round) & Per Stone & ₹0.10/stone & 5,000 & ₹500 \\
Setter (Fancy) & Per Stone & ₹0.20/stone & 2,000 & ₹400 \\
Polisher & Hourly & ₹7/hr & 80 hrs & ₹560 \\
\hline
Total Engagement Value &  &  &  & ₹2,160 \\
\hline
RKCS Commission (variable) &  &  &  & ₹100-150 \\
\hline
\end{tabular}
\caption{Sample Monthly Wage Calculation}
\end{table}

---

## 9. Critical Process Flows

### 9.1 Job Approval Workflow
```
Employer Posts Job
    ↓
Admin Reviews Post
    ↓
Admin Approves/Rejects
    ↓
IF APPROVED → Auto-Report Generated
    → Sent to RKCS Accounting Portal
    → Auto-notification to Employees
    → Employees Can Apply
```

### 9.2 Employer-Employee Matching
```
Employee Applies
    ↓
Employer Reviews Profile
    ↓
Employer Approves/Rejects
    ↓
IF APPROVED → Auto-Report Generated
    → Auto-notification to Employee
    → Gatepass Link Generated
    → Employee Receives Gatepass
    → RKCS Accounting Records Created
```

### 9.3 Attendance & Payment
```
Employee Works (tracked via RKCS machine/software)
    ↓
Employer Creates Hisab (before 7th of month)
    ↓
Employer Sends Hisab to RKC (PDF/Excel)
    ↓
RKC Verifies Names & RKCS Codes
    ↓
RKC Sends Invoice to Employer
    ↓
Payment & Commission Settlement
```

---

## 10. MERN Stack Implementation Notes

### 10.1 Frontend (React)
- **Employer Dashboard**: Job posting form, employee list, wage calculator, hisab upload
- **Employee Dashboard**: Job search, applications, gatepass management, earnings tracker
- **Admin Dashboard**: User verification, vacancy review, commission tracking, reporting
- **Responsive Design**: Works on desktop, tablet, mobile

### 10.2 Backend (Express.js + Node.js)
- **Authentication**: Secure login for all user types with unique RKCS codes
- **Job Management APIs**: Create, update, delete vacancies
- **Application APIs**: Submit, approve, reject applications
- **Notification Service**: SMS/email alerts for approvals, gatepass links
- **File Upload**: Handle PDF/Excel hisab uploads and processing
- **Commission Calculation**: Automated calculation based on engagement type

### 10.3 Database (MongoDB)
- **Collections**:
  - Users (employers, employees, admins)
  - Jobs (vacancies and postings)
  - Applications (submissions and approvals)
  - Billing (wage calculations, hisabs, invoices)
  - Attendance (logs from RKCS machines)
  - Commissions (earnings tracking)
  - GatePasses (access management)

### 10.4 Integration Points
- **Attendance Hardware**: RKCS machine data sync
- **SMS Gateway**: Notification delivery (gatepass links, approvals)
- **Email Service**: Invoice generation and delivery
- **File Storage**: Cloud storage for PDFs/Excel exports
- **Payment Gateway**: (Optional) Direct employer-employee payments

---

## 11. Most Important Rules & Features

### 11.1 Identity & ID Management
- **One Aadhar + One PAN = One ID Only** (for both employers and employees)
- Each user receives unique RKCS ID code
- RKCS tracks all users/companies by their unique code
- Prevents duplicate registrations and fraud

### 11.2 Automatic Reporting
- **When employer approves employee** → Automatic report generates on RKCS accounting portal
- All engagement details captured automatically
- Ensures complete audit trail
- Facilitates commission calculation

### 11.3 Attendance Integration
- RKC attendance software/machines work seamlessly with platform
- Automatic attendance synchronization
- RKC personnel can verify worksite visits
- Links attendance to wage calculations

### 11.4 Commission Calculation
- Automatic calculation based on engagement type
- Transparent rate structure displayed at job posting
- Calculated from employer rates mentioned in vacancy
- RKC earnings tied to successful placements

---

## 12. Security & Compliance

- All user data encrypted in transit and at rest
- Secure authentication with role-based access control
- Document verification process before account activation
- Audit logs for all transactions and approvals
- Compliance with labor laws and regulations
- Data privacy and protection measures

---

## 13. Future Enhancements

- **Payment Integration**: Direct payment processing through platform
- **Advanced Analytics**: Dashboard insights for employers and RKC
- **Mobile App**: Native iOS/Android apps for better UX
- **Video Verification**: Video interviews between employers and candidates
- **Rating System**: Employer and employee ratings for transparency
- **Skill Verification**: Certification programs for quality assurance

---

**Document Version**: 1.0  
**Last Updated**: December 2025  
**For**: Full Stack MERN Development  
**Platform**: Placement Website & Mobile App