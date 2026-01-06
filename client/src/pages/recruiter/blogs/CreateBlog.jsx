import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { blogApi, companyApi } from "../../../api/api";
import { toast } from "react-toastify";
import {
  HiArrowLeft,
  HiSave,
  HiEye,
  HiPhotograph,
  HiNewspaper,
  HiCalendar,
  HiStar,
  HiTrendingUp,
  HiUserGroup,
  HiOfficeBuilding,
  HiExclamationCircle
} from "react-icons/hi";

// Yup validation schema
const blogValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(10, 'Title must be at least 10 characters long')
    .max(200, 'Title cannot exceed 200 characters')
    .required('Title is required'),
  
  description: Yup.string()
    .trim()
    .min(20, 'Description must be at least 20 characters long')
    .max(200, 'Description cannot exceed 200 characters')
    .required('Description is required'),
  
  content: Yup.string()
    .trim()
    .min(100, 'Content must be at least 100 characters for a meaningful blog post')
    .max(10000, 'Content cannot exceed 10,000 characters')
    .required('Content is required'),
  
  category: Yup.string()
    .oneOf(['event', 'achievement', 'growth', 'culture', 'news'], 'Please select a valid category')
    .required('Category is required'),
  
  image: Yup.string()
    .url('Please enter a valid image URL')
    .test('is-image-url', 'URL should point to an image', function(value) {
      if (!value) return true; // Optional field
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const lowerValue = value.toLowerCase();
      return (
        imageExtensions.some(ext => lowerValue.includes(ext)) ||
        lowerValue.includes('unsplash') ||
        lowerValue.includes('imgur') ||
        lowerValue.includes('cloudinary')
      );
    })
    .nullable()
});

export default function CreateBlog() {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const [companyId, setCompanyId] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  const categories = [
    { value: "event", label: "Event", icon: <HiCalendar />, desc: "Company events, conferences, meetups" },
    { value: "achievement", label: "Achievement", icon: <HiStar />, desc: "Awards, milestones, recognitions" },
    { value: "growth", label: "Growth Story", icon: <HiTrendingUp />, desc: "Company expansion, new markets" },
    { value: "culture", label: "Company Culture", icon: <HiUserGroup />, desc: "Team activities, work environment" },
    { value: "news", label: "Company News", icon: <HiOfficeBuilding />, desc: "General updates, announcements" }
  ];

  // Initial form values
  const initialValues = {
    title: "",
    description: "",
    content: "",
    category: "news",
    image: ""
  };

  // Fetch company ID on mount
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setCompanyLoading(true);
        const response = await companyApi.get(`/recruiter/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const company = response.data.data || response.data;
        if (company?._id) {
          setCompanyId(company._id);
        } else {
          toast.error('Company not found. Please register your company first.');
          navigate('/recruiter/company/registration');
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        toast.error('Failed to load company information');
        navigate('/recruiter/company/registration');
      } finally {
        setCompanyLoading(false);
      }
    };

    if (user?._id) {
      fetchCompany();
    }
  }, [user, token, navigate]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!companyId) {
      toast.error('Company information is missing. Please refresh and try again.');
      setSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        title: values.title.trim(),
        description: values.description.trim(),
        content: values.content.trim(),
        category: values.category,
        image: values.image || undefined,
        status: values.status, // Will be set by button click
        companyId
      };

      console.log('Submitting blog data:', dataToSubmit);

      const response = await blogApi.post('/', dataToSubmit, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Blog created successfully:', response.data);

      toast.success(
        `✅ Blog ${values.status === 'published' ? 'published' : 'saved as draft'} successfully!`,
        { autoClose: 3000 }
      );

      // Navigate after short delay
      setTimeout(() => {
        navigate("/recruiter/blogs");
      }, 1000);
    } catch (error) {
      console.error("Error creating blog:", error);
      console.error("Error response:", error.response?.data);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create blog. Please try again.';
      
      toast.error(`❌ ${errorMessage}`);
      
      // Set backend validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (companyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading company information...</p>
        </div>
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={blogValidationSchema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue, validateForm, setFieldTouched }) => (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-5xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/recruiter/blogs")}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    disabled={isSubmitting}
                  >
                    <HiArrowLeft className="text-2xl text-gray-600" />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <HiNewspaper className="text-2xl text-emerald-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Create Blog Post</h1>
                      <p className="text-sm text-gray-600">Share your company's story</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      // Set status to draft
                      await setFieldValue('status', 'draft');
                      // Validate and submit
                      const formErrors = await validateForm();
                      if (Object.keys(formErrors).length === 0) {
                        await handleSubmit({ ...values, status: 'draft' }, { 
                          setSubmitting: (val) => {}, 
                          setErrors: () => {} 
                        });
                      } else {
                        // Mark all fields as touched to show errors
                        Object.keys(formErrors).forEach(field => setFieldTouched(field, true));
                        toast.error('Please fix all validation errors before saving');
                      }
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiSave />
                    {isSubmitting ? 'Saving...' : 'Save Draft'}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      // Set status to published
                      await setFieldValue('status', 'published');
                      // Validate and submit
                      const formErrors = await validateForm();
                      if (Object.keys(formErrors).length === 0) {
                        await handleSubmit({ ...values, status: 'published' }, { 
                          setSubmitting: (val) => {}, 
                          setErrors: () => {} 
                        });
                      } else {
                        // Mark all fields as touched to show errors
                        Object.keys(formErrors).forEach(field => setFieldTouched(field, true));
                        toast.error('Please fix all validation errors before publishing');
                      }
                    }}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HiEye />
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-6 py-8">
            <Form className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Title */}
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Title <span className="text-red-500">*</span>
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  placeholder="e.g., We've Reached 1000 Employees Milestone!"
                  maxLength={200}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg transition ${
                    errors.title && touched.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage name="title">
                    {msg => (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <HiExclamationCircle /> {msg}
                      </p>
                    )}
                  </ErrorMessage>
                  <p className="text-xs text-gray-500 ml-auto">{values.title.length}/200</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Brief summary of your blog post (will be shown in preview)"
                  rows={3}
                  maxLength={200}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition ${
                    errors.description && touched.description ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage name="description">
                    {msg => (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <HiExclamationCircle /> {msg}
                      </p>
                    )}
                  </ErrorMessage>
                  <p className="text-xs text-gray-500 ml-auto">{values.description.length}/200</p>
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFieldValue('category', cat.value)}
                      className={`p-4 border-2 rounded-lg text-left transition ${
                        values.category === cat.value
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl text-emerald-600">{cat.icon}</span>
                        <span className="font-semibold text-gray-900">{cat.label}</span>
                      </div>
                      <p className="text-xs text-gray-600">{cat.desc}</p>
                    </button>
                  ))}
                </div>
                <ErrorMessage name="category">
                  {msg => (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                      <HiExclamationCircle /> {msg}
                    </p>
                  )}
                </ErrorMessage>
              </div>

              {/* Image URL */}
              <div className="mb-6">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL (Optional)
                </label>
                <div className="relative">
                  <HiPhotograph className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                  <Field
                    type="url"
                    id="image"
                    name="image"
                    placeholder="https://example.com/image.jpg or https://images.unsplash.com/..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition ${
                      errors.image && touched.image ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                    }`}
                  />
                </div>
                <ErrorMessage name="image">
                  {msg => (
                    <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                      <HiExclamationCircle /> {msg}
                    </p>
                  )}
                </ErrorMessage>
                {values.image && !errors.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Image Preview:</p>
                    <img
                      src={values.image}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
                        toast.error('Failed to load image. Please check the URL.');
                      }}
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: Use high-quality images from Unsplash or upload to Imgur
                </p>
              </div>

              {/* Content */}
              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Blog Content <span className="text-red-500">*</span>
                </label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  placeholder="Write your blog content here...\n\nShare the story, include details, and make it engaging!\n\nYou can use line breaks to separate paragraphs."
                  rows={15}
                  maxLength={10000}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none font-mono text-sm transition ${
                    errors.content && touched.content ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-emerald-500'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <ErrorMessage name="content">
                    {msg => (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <HiExclamationCircle /> {msg}
                      </p>
                    )}
                  </ErrorMessage>
                  <p className="text-xs text-gray-500 ml-auto">{values.content.length}/10,000</p>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <HiNewspaper />
                  Tips for a Great Blog Post
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ Use a catchy, descriptive title (10-200 characters)</li>
                  <li>✓ Write a compelling description (20-200 characters)</li>
                  <li>✓ Add a high-quality cover image (optional)</li>
                  <li>✓ Write substantial content (minimum 100 characters)</li>
                  <li>✓ Structure your content with clear paragraphs</li>
                  <li>✓ Include specific details and examples</li>
                  <li>✓ Proofread before publishing</li>
                  <li>✓ Save as draft first to review later</li>
                </ul>
              </div>
            </Form>
          </div>
        </div>
      )}
    </Formik>
  );
}
