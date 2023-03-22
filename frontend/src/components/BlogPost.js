import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import "../styles/BlogPost.css";

function BlogPost() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getBlogPost() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/blogs/${id}`);
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
      <h1 style={{textAlign: "center"}}>{blog.title}</h1>
      <br />
      <p className="text-muted"><i>Published: </i>{new Date(blog.postTime).toLocaleDateString()}</p>
      <p className="text-muted"><i>Author: </i>{blog.author.username}</p>
      <hr />
      <div className="view ql-editor" dangerouslySetInnerHTML={{ __html: blog.content }} />
      <CommentSection blogId={id} />
    </div>

  );
}

export default BlogPost;
