import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import "../styles/BlogPost.css";

function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function getBlogPost() {
      try {
        const response = await axios.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        setError("Sorry, an error occurred.");
      } finally {
        setLoading(false);
      }
    }

    getBlogPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1>{blog.title}</h1>
      <p className="text-muted">{new Date(blog.postTime).toLocaleDateString()}</p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      <CommentSection blogId={id} />
    </div>
  );
}

export default BlogPost;