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
      const sortedBlogs = res.data.sort((a, b) => new Date(b.postTime) - new Date(a.postTime));
      setBlogs(sortedBlogs);
      setFilteredBlogs(sortedBlogs);
      const topicsSet = new Set(topicsList);
      sortedBlogs.forEach((blog) => {
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
      )
      setFilteredBlogs(filteredBlogs);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  const replaceHeadersWithParagraphs = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headerTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  
    headerTags.forEach((tag) => {
      const headers = doc.querySelectorAll(tag);
      headers.forEach((header) => {
        const p = document.createElement("p");
        p.innerHTML = header.innerHTML;
        header.parentNode.replaceChild(p, header);
      });
    });
  
    return doc.body.innerHTML;
  };

  return (
    <div className="home-container">
      <h1 style={{textAlign: "center"}}>Welcome to The Tunnicliff Blog!</h1>
      <p id="about" style={{textAlign: "center", fontSize: "1.3rem"}}>
        My name is Korry Tunnicliff, and I am a software developer. 
        <br /><br />
        This blog is dedicated to logging my progress with various issues in projects,
        as well as interesting things I have learned throughout the course of my software development journey. This website was built with the use
        use of the MERN stack, and is hosted on both Heroku and Netlify.
      </p>
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
       <div className="blog-count">
          Blogs: {filteredBlogs.length}
        </div>
      </div>
      <br />
      <div className="blogs-container">
        {filteredBlogs.map((blog) => (
          <div
            className="blog-card"
            key={blog._id}
            style={
              blog.coverImage
                ? {
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7)), url(${process.env.REACT_APP_BASE_API_URL}/images/${blog.coverImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }
                : {}
            }
          >
          <div className="blog-card-header">
            <h2 className="blog-card-title">
              <Link to={`/blogs/${blog._id}`} className="blog-card-link">
                {blog.title}
              </Link>
            </h2>
            <div className="blog-card-meta">
              <span className="blog-card-author">
                <h4>Author: &nbsp; {blog.author.username}</h4>
              </span>
              <span className="blog-card-topic">
                Topics: &nbsp; <u>{blog.topics.join(', ')}</u>
              </span>
              <br />
              <span className="blog-card-date">
                Date: &nbsp; {formatDate(blog.postTime)}
              </span>
            </div>
          </div>
          <div className="blog-card-body">
          <div
            className="blog-card-content"
            dangerouslySetInnerHTML={{
              __html: replaceHeadersWithParagraphs(blog.content),
            }}
          ></div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default Home;