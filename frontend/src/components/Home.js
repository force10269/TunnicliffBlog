import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/Home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await axios.get("/blogs");
      setBlogs(res.data);
      setFilteredBlogs(res.data);
      const topicsSet = new Set();
      res.data.forEach((blog) => {
        topicsSet.add(blog.topic);
      });
      setTopics(Array.from(topicsSet));
    };
    fetchBlogs();
  }, []);

  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    if (event.target.value === "") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((blog) => blog.topic === event.target.value));
    }
  };

  return (
    <div className="home-container">
      <div className="topics-container">
        <select value={selectedTopic} onChange={handleTopicChange}>
          <option value="">All topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>
      <div className="blogs-container">
        {filteredBlogs.map((blog) => (
          <div key={blog._id} className="blog-card">
            <div className="blog-card-header">
              <Link to={`/blogs/${blog._id}`}>
                <h2 className="blog-card-title">{blog.title}</h2>
              </Link>
              <div className="blog-card-meta">
                <span className="blog-card-topic">{blog.topic}</span>
                <span className="blog-card-date">{new Date(blog.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="blog-card-body">{blog.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
