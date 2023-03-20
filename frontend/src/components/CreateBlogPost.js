import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateBlogPost.css";

const CreateBlogPost = () => {
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [error, setError] = useState("");
  const history = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlog((prevBlog) => {
      return {
        ...prevBlog,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/blogs", blog);
      if (response.status === 201) {
        history.push(`/blog/${response.data._id}`);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="create-blog-post-container">
      <h2>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={handleChange}
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          required
          onChange={handleChange}
        />

        <label htmlFor="author">Author</label>
        <input
          type="text"
          id="author"
          name="author"
          required
          onChange={handleChange}
        />

        <button type="submit">Create Blog Post</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateBlogPost;
