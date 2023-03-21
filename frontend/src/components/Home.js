import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(new Set());

  useEffect(() => {
    const topicsList = process.env.REACT_APP_FILTERS.split(',');
    const fetchBlogs = async () => {
      const res = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/blogs`);
      setBlogs(res.data);
      setFilteredBlogs(res.data);
      const topicsSet = new Set(topicsList);
      res.data.forEach((blog) => {
        if (blog.topics) {
          blog.topics.forEach((topic) => topicsSet.add(topic));
        }
      });
      setTopics(Array.from(topicsSet).filter((topic) => topic !== undefined));
    };
    fetchBlogs();
  }, []);
  
  const handleTopicClick = (topic) => {
    const newSelectedTopics = new Set(selectedTopics);
    if (selectedTopics.has(topic)) {
      newSelectedTopics.delete(topic);
    } else {
      newSelectedTopics.add(topic);
    }
    setSelectedTopics(newSelectedTopics);
    filterBlogs(newSelectedTopics);
  };
  
  const handleClearClick = () => {
    setSelectedTopics(new Set());
    filterBlogs(new Set());
  };
  
  const filterBlogs = (selectedTopics) => {
    if (selectedTopics.size === 0) {
      setFilteredBlogs(blogs);
    } else {
      const filteredBlogs = blogs.filter((blog) =>
        blog.topics ? blog.topics.some((topic) => selectedTopics.has(topic)) : false
      );
      setFilteredBlogs(filteredBlogs);
    }
  };

  return (
    <div className="home-container">
      <h1 style={{textAlign: "center"}}>Welcome to The Tunnicliff Blog!</h1>
      <br />
      <div className="topics-container">
        <div className="scroll-container">
          <ul className="topic-list">
            {topics.map((topic) => (
              <li
                key={topic}
                className={`topic-button ${
                  selectedTopics.has(topic) ? "active" : ""
                }`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
        <div className="clear-container">
          <button className="clear-button" onClick={handleClearClick}>
            Clear topics
          </button>
       </div> 
      </div>
      <br />
      <div className="blogs-container">
        {filteredBlogs.map((blog) => (
          <div className="blog-card" key={blog.id}>
            <div className="blog-card-header">
              <h2 className="blog-card-title">
                <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
              </h2>
              <div className="blog-card-meta">
                <span className="blog-card-topic">{blog.topic}</span>
                <span className="blog-card-date">{blog.date}</span>
              </div>
            </div>
            <div className="blog-card-body">
              <p>{blog.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;