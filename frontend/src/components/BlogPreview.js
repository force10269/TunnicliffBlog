import React from "react";
import BlogPost from "./BlogPost";

const BlogPreview = () => {
  const blog = JSON.parse(localStorage.getItem("previewBlog"));

  const handleClosePageClick = (event) => {
    event.preventDefault();
    window.close(); // Close the current tab
  };

  if (!blog) {
    return <p>Blog data not found.</p>;
  }

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button className="close-page-button" onClick={handleClosePageClick}>
          Close Page
        </button>
      </div>
      <BlogPost blog={blog} />
    </>
  );
};

export default BlogPreview;
