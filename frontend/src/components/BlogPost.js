import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import "../styles/BlogPost.css";
import 'highlight.js/styles/monokai-sublime.css';

function BlogPost({ blog: blogProp }) {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if(blogProp) {
      setBlog(blogProp);
      setLoading(false);
    } else {
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
    }
  }, [id, blogProp])

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
      <div className='ql-snow'> 
        <div className='view ql-editor' dangerouslySetInnerHTML={{ __html: blog.content }} /> 
      </div>
      {!blogProp && <CommentSection blogId={id} />}
    </div>

  );
}

export default BlogPost;
