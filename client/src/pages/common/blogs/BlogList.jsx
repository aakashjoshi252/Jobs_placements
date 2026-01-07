import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { blogApi } from "../../../api/api";
import BlogCard from "./BlogsCards";
import "./blogs.css";
import { HiNewspaper, HiSearch, HiFilter } from "react-icons/hi";

export default function BlogList() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "event", label: "Events" },
    { value: "achievement", label: "Achievements" },
    { value: "growth", label: "Growth Stories" },
    { value: "culture", label: "Company Culture" },
    { value: "news", label: "Company News" }
  ];

  useEffect(() => {
    fetchBlogs();
  }, [currentPage, selectedCategory, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...(selectedCategory !== "all" && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      };

      const response = await blogApi.get("/", { params });
      
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogClick = (id) => {
    navigate(`/blogs/${id}`);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };

  return (
    <div className="blogs-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-12 px-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <HiNewspaper className="text-5xl" />
            <h1 className="text-4xl font-bold">Latest Career Tips & Job Guidance</h1>
          </div>
          <p className="text-emerald-100 text-lg">Discover insights from top companies and career experts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Blogs</label>
              <div className="relative">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <div className="relative">
                <HiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {!loading && blogs.length > 0 && (
          <div className="mb-4">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{blogs.length}</span> blog posts
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading amazing content...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <HiNewspaper className="text-7xl text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Blogs Found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to share insights! New blogs coming soon."}
            </p>
            {(searchTerm || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="blogs-container">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onClick={() => handleBlogClick(blog._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show first 2, last 2, and current page with neighbors
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${
                            currentPage === pageNum
                              ? "bg-emerald-600 text-white"
                              : "bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      (pageNum === currentPage - 2 && pageNum > 1) ||
                      (pageNum === currentPage + 2 && pageNum < totalPages)
                    ) {
                      return (
                        <span key={pageNum} className="px-2 py-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
