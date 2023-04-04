import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const LazyBlogCard = ({ blog, formatDate, truncateContent, replaceHeadersWithParagraphs }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = cardRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  if (!isVisible) {
    return <div ref={cardRef} className="blog-card-placeholder"></div>;
  }

  return (
    <div
            className="blog-card"
            ref={cardRef}
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
          <div className="ql-snow blog-card-body">
            <div
              className="view ql-editor blog-card-content"
              dangerouslySetInnerHTML={{
                __html: truncateContent(replaceHeadersWithParagraphs(blog.content)),
              }}
            ></div>
          </div>
        </div>
  );
};

export default LazyBlogCard;
