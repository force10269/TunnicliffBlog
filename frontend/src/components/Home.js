import { useState, useEffect } from "react";
import axios from "axios";
import LazyBlogCard from "./LazyBlogCard";
import "../styles/Home.css";

const Home = ({ searchValue }) => {
  const [blogs, setBlogs] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    const topicsList = process.env.REACT_APP_FILTERS.split(",");
    const fetchBlogs = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/blogs`
      );
      const sortedBlogs = res.data.sort(
        (a, b) => new Date(b.postTime) - new Date(a.postTime)
      );
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

  const paginate = (items, page) => {
    const startIndex = (page - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    return items.slice(startIndex, endIndex);
  };

  useEffect(() => {
    filterBlogs(selectedTopics, searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blogs, selectedTopics, searchValue]);

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

  const filterBlogs = (selectedTopics, searchValue = "") => {
    /*
      This is a complicated line that deals with a lot of scenarios.
      We are basically covering every scenario where either
      the selectedTopics or searchValue are null or have a value
    */
    let filteredBlogs = blogs.filter(
      (blog) =>
        (selectedTopics.size === 0 ||
          (blog.topics &&
            blog.topics.some((topic) => selectedTopics.has(topic)))) &&
        (!searchValue.trim() ||
          blog.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    );

    setFilteredBlogs(filteredBlogs);
    setCurrentPage(1);
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

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

  function truncateContent(content, maxLength = 100) {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + "...";
  }

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = paginate(filteredBlogs, currentPage);

  return (
    <main className="home-container" role="main">
      <h1 style={{textAlign: "center"}}>Welcome to The Tunnicliff Blog!</h1>
      <section id="about" style={{textAlign: "center", fontSize: "1.3rem", paddingTop: "30px"}}>
        My name is Korry Tunnicliff, and I am a software developer. 
        <br /><br />
        This blog is dedicated to logging my progress with various issues in projects,
        as well as interesting things I have learned throughout the course of my software development journey. This website was built with the use
        use of the MERN stack, and is hosted on both Heroku and Netlify.
      </section>
      <br />
      <nav className="topics-container" aria-label="Topics">
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
       <div className="blog-count" aria-live="polite">
          Blogs: {filteredBlogs.length}
        </div>
      </nav>
      <br />
      <section className="blogs-container" aria-label="Blog posts">
        {paginatedBlogs.map((blog) => (
          <LazyBlogCard
            key={blog._id}
            blog={blog}
            formatDate={formatDate}
            truncateContent={truncateContent}
            replaceHeadersWithParagraphs={replaceHeadersWithParagraphs}
          />
        ))}
      </section>
      <nav className="pagination-container" aria-label="Pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`pagination-button ${
              currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() => handlePageClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </nav>
    </main>
  );
};

export default Home;
