import axios from "axios"
export const api = axios.create({
    baseURL: `http://localhost:3000`

    // "http://localhost:3000/user/login/"
    // "http://localhost:3000/user/register/"
});

export const userApi = axios.create({
    baseURL: `http://localhost:3000`

    // "http://localhost:3000/user/login/"
    // "http://localhost:3000/user/register/"
});

export const companyApi = axios.create({
    baseURL: `http://localhost:3000/company`

    // "http://localhost:3000/company/:id"
    // "http://localhost:3000/company/recruiter/:recruiterId"
});
export const jobsApi = axios.create({
    baseURL: `http://localhost:3000/jobs`

    // http://localhost:3000/jobs/create" 
    // http://localhost:3000/jobs/:id"" 
    // "http://localhost:3000/jobs/"
    // "http://localhost:3000/jobs/recruiter/:recruiterId"
    // "http://localhost:3000/jobs/company/:recruiterId"
});
export const resumeApi = axios.create({
    baseURL: `http://localhost:3000/resume`

    // http://localhost:3000/resume/create" 
    // "http://localhost:3000/resume/"
    // "http://localhost:3000/resume/recruiter/:recruiterId"
    // "http://localhost:3000/resume/company/:recruiterId"
});

export const applicationApi = axios.create({
    baseURL: `http://localhost:3000/application`

    // http://localhost:3000//application/apply" 
    // "http://localhost:3000/applications/"
    // "http://localhost:3000/applications/recruiter/:recruiterId"
    // "http://localhost:3000/applications/company/:recruiterId"
});

// export const uploadApi = axios.create({
//     baseURL: `http://localhost:3000/uploads`
    // "http://localhost:3000/upload/save"
    // "http://localhost:3000/upload/getimage"
// })