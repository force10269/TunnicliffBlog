import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../styles/CreateBlogPost.css";

const CreateBlogPost = () => {
  const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
  const filters = process.env.REACT_APP_FILTERS.split(',');
  const [selectedFilters, setSelectedFilters] = useState(new Set());
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    author: "",
    topics: "",
    image: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    const user = JSON.parse(localStorage.getItem("user"));
    // Remove email, password, and __v fields
    delete user.email;
    delete user.password;
    delete user.__v;

    // Rename _id field to userId
    user.userId = user._id;
    delete user._id;
    const blogWithAuthor = { ...blog, author: user, topics: Array.from(selectedFilters), };
    try {
      const response = await axios.post(`${BASE_API_URL}/blogs`, blogWithAuthor);
      if (response.status === 201) {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setBlog((prevBlog) => {
          return {
            ...prevBlog,
            image: {
              name: file.name,
              dataUrl: reader.result,
            },
          };
        });
      };
    }
  };

  const handleFilterClick = (topic) => {
    const newSelectedFilters = new Set(selectedFilters);
    if (selectedFilters.has(topic)) {
      newSelectedFilters.delete(topic);
    } else {
      newSelectedFilters.add(topic);
    }
    setSelectedFilters(newSelectedFilters);
  };

  const handleClearClick = (event) => {
    event.preventDefault();
    setSelectedFilters(new Set());
  };

  return (
    <div className="create-blog-post-container">
      <h2 style={{textAlign: "center"}}>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        {blog.image ? (
          <div className="selected-image-container">
            <img src={blog.image.dataUrl} alt="Selected" />
            <button onClick={() => setBlog((prevBlog) => ({ ...prevBlog, image: null }))}>X</button>
          </div>
        ) : (
          <div className="file-input-container">
            <label htmlFor="image">Image</label>
            <br />
            <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
          </div>
        )}

        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          onChange={handleChange}
        />

        <label htmlFor="content">Content</label>
        <ReactQuill
          id="content"
          name="content"
          value={blog.content}
          onChange={(value) => setBlog((prevBlog) => ({ ...prevBlog, content: value }))}
        />
        <br /><br />

        <label htmlFor="topic">Topic(s)</label>
        <ul className="topic-list">
            {filters.map((filter) => (
              <li
                key={filter}
                className={`topic-button ${
                  selectedFilters.has(filter) ? "active" : ""
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </li>
            ))}
        </ul>

        <div className="clear-container">
          <button className="clear-button" onClick={handleClearClick}>
            Clear topics
          </button>
       </div> 
        <br />

        <button id="submit" type="submit">Create Blog Post</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CreateBlogPost;
