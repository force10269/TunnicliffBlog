import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";
import LoadingOverlay from "./LoadingOverlay";
import { FaThumbsUp } from "react-icons/fa";
import "../styles/BlogPost.css";
import "highlight.js/styles/monokai-sublime.css";
import defaultProfilePic from "../images/defaultProfilePic.png";

function BlogPost({ blog: blogProp }) {
  const { slug } = useParams();
  const [id, setId] = useState("");
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    user.userId = user._id;
    delete user._id;
  }

  async function getLikeId() {
    const likeResponse = await axios.get(
      `${process.env.REACT_APP_BASE_API_URL}/likes?slug=${slug}`
    );
    if (user) {
      const likedByUser = likeResponse.data.find(
        (like) => like.author.userId === user.userId
      );
      if (likedByUser) {
        setLiked(likedByUser);
      } else {
        setLiked(false);
      }
    }
  }

  async function handleLike() {
    try {
      if (liked) {
        await axios.delete(
          `${process.env.REACT_APP_BASE_API_URL}/likes/${liked._id}`
        );
        setLikeCount(likeCount - 1);
        getLikeId();
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_API_URL}/likes`, {
          slug: blog.slug,
          author: user,
        });
        setLikeCount(likeCount + 1);
        getLikeId();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function getBlogPost() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/blogs/${slug}`
        );
        setBlog(response.data);
        setId(response.data._id);
        const likeResponse = await axios.get(
          `${process.env.REACT_APP_BASE_API_URL}/likes?slug=${response.data.slug}`
        );
        if (user) {
          const likedByUser = likeResponse.data.find(
            (like) => like.author.userId === user.userId
          );
          if (likedByUser) {
            setLiked(likedByUser);
          }
        }
        setLikeCount(likeResponse.data.length);
      } catch (error) {
        setError("Sorry, an error occurred.");
      } finally {
        setLoading(false);
      }
    }
  
    if (blogProp) {
      setBlog(blogProp);
      setId(blogProp._id);
      setLoading(false);
    } else {
      getBlogPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, id, blogProp]);

  if (loading) {
    return <LoadingOverlay message="Loading..."/>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <h1 style={{textAlign: "center"}} tabIndex="0">{blog.title}</h1>
      <br />
      <span className="blog-card-topic" tabIndex="0">
        <i>Topics: </i><u>{blog.topics.join(', ')}</u>
      </span>
      <p className="text-muted" tabIndex="0">
        <i>Published: </i>{new Date(blog.postTime).toLocaleDateString()}
      </p>
      <p className="text-muted" tabIndex="0">
        <i>Author: </i>
        {blog.author.profilePic ? (
          <img
            src={`${process.env.REACT_APP_BASE_API_URL}/images/${blog.author.profilePic}`}
            alt="Author's Profile"
            style={{ borderRadius: 10, width: 50, height: 50, marginLeft: 10, marginRight: 10, verticalAlign: 'middle' }}
          />
        ) : (
          <img
            src={defaultProfilePic}
            alt="Default Profile"
            style={{ borderRadius: 10, width: 50, height: 50, marginLeft: 10, marginRight: 10, verticalAlign: 'middle' }}
          />
        )}
        {blog.author.username}
      </p>
      <div className="like-container">
        {user && (
          <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike} aria-label={liked ? "Unlike this blog post" : "Like this blog post"}>
          <FaThumbsUp /> Like
        </button>
        )}
        <span style={{paddingLeft: "10px"}} className="like-count" tabIndex="0">{likeCount} likes</span>
      </div>
      <hr />
      <div className='ql-snow'> 
        <div className='view ql-editor' dangerouslySetInnerHTML={{ __html: blog.content }} tabIndex="0" /> 
      </div>
      {!blogProp && <CommentSection slug={slug} />}
    </div>
  );
}

export default BlogPost;
