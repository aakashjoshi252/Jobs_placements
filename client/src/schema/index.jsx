import * as yup from "yup"

//  user Registration 
export const regisSchema = yup.object({
  username: yup.string().required("Please enter username").min(3),
  email: yup.string().required("Please enter email").email("Please enter a valid email").lowercase("Email is always lowercase"),
  password: yup.string().required("Please enter password").min(6),
  phone: yup.string().required("Please enter mobile no.").min(10).max(10),
  role: yup.string().required("Please enter address").min(5),
  checkbox: yup.boolean()
});
// Recruiter Compmpany Registration
export const companyValidation = yup.object({
  uploadLogo: yup.mixed().required("Logo upload is required"),
  companyName: yup.string().required("Company name is required"),
  industry: yup.string().required("Industry type is required"),
  size: yup.string().oneOf(["1-10", "11-50", "51-200", "201-500", "500+"], "Invalid company size").required("Company size is required"),
  establishedYear: yup.number().min(1800, "Year must be valid").max(new Date().getFullYear(), "Year can't be in the future").required("Established year is required"),
  website: yup.string().url("Must be a valid URL").nullable(),
  location: yup.string().required("Location is required"),
  description: yup.string().required("Description is required"),
  contactEmail: yup.string().email("Invalid email address").required("Contact email is required"),
  contactNumber: yup.string().required("Contact number is required"),
});

//  Job Posting 
export const jobValidationSchema = yup.object({
  title: yup.string().required("Job title is required").min(3, "Title must be at least 3 characters"),
  description: yup.string().required("Job description is required").min(20, "Description must be at least 20 characters"),
  jobLocation: yup.string().required("Job location is required"),
  jobType: yup.string().oneOf(["On-site", "Remote", "Hybrid"], "Invalid job type").required("Job type is required"),
  empType: yup.string().oneOf(["Full-time", "Part-time", "Contract", "Internship"], "Invalid employee type").required("Employee type is required"),
  experience: yup.string().oneOf(["Fresher", "Junior", "Mid", "Senior"], "Invalid experience level").required("Experience level is required"),
  salary: yup.string().required("Salary is required"),
  openings: yup.number().required("Number of openings required").min(1, "At least 1 opening is required"),
  deadline: yup.date().required("Deadline is required").min(new Date(), "Deadline must be a future date"),
  skills: yup.string().required("Skills are required").min(2, "Please enter at least 2 skills separated by commas"),
  additionalRequirement: yup.string().nullable(),
  companyName: yup.string().required("Company name is required"),
  CompanyEmail: yup.string().email("Invalid email format").required("Company email is required"),
  CompanyAddress: yup.string().required("Company address is required"),
  companyId: yup.string().required("Company selection is required"),
  recruiterId: yup.string().required("Recruiter ID missing. Please login again!"),
});
