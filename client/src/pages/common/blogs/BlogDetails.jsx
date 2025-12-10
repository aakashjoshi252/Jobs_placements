import { useParams, useNavigate } from "react-router-dom";
import "./blogs.css";

export default function BlogDetails({ blogs }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const blog = blogs.find((b) => b._id === id);

  if (!blog) return <h2>Blog not found!</h2>;

  return (
    <div className="blog-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      
      <img src={blog.image} alt={blog.title} className="blog-details-img" />

      <h2>{blog.title}</h2>
      <p className="blog-date">📅 {blog.date}</p>

      <p className="blog-full-content">{blog.content}</p>
    </div>
  );
}
