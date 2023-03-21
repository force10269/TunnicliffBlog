import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "../styles/CommentForm.css";

function CommentForm(props) {
  const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState("");

  function handleCommentTextChange(event) {
    setCommentText(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    // Remove email, password, and __v fields
    delete user.email;
    delete user.password;
    delete user.__v;

    // Rename _id field to userId
    user.userId = user._id;
    delete user._id;

    const comment = {
      blogId: props.blogId,
      text: commentText,
      author: user
    }

    try {
      await axios.post(`${BASE_API_URL}/comments`, comment)
    } catch (err) {
      setError(err.message);
    }

    // Clear the comment text field
    setCommentText("");
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="comment-text">Add a comment:</label>
        <textarea
          className="form-control"
          id="comment-text"
          value={commentText}
          onChange={handleCommentTextChange}
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

CommentForm.propTypes = {
  onSubmitComment: PropTypes.func.isRequired,
};

export default CommentForm;
