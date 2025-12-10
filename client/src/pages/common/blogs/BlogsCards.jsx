import "./blogs.css";


export default function BlogCard({ blog, onClick }) {
  return (
    <div className="blog-card" key={blog._id} onClick={() => onClick(blog._id)}>
      <img src={blog.image} alt={blog.title} className="blog-img" />
      <div className="blog-content">
        <h3>{blog.title}</h3>
        <p className="blog-snippet">
          {blog.description.length > 100 ? (
            `${blog.description.substring(0, 100)}...`
          ) : (
            blog.description
          )}
        </p>
        <span className="blog-read">Read More →</span>
      </div>
    </div>
  );
}

