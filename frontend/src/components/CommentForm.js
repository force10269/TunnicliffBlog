import React, { useState } from "react";
import axios from "axios";
import "../styles/CommentForm.css";

function CommentForm(props) {
  const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;
  const [commentText, setCommentText] = useState("");

  function handleCommentTextChange(event) {
    setCommentText(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
  
    // Rename _id field to userId
    user.userId = user._id;
    delete user._id;
  
    const comment = {
      slug: props.slug,
      text: commentText,
      author: user,
    };
  
    try {
      const response = await axios.post(`${BASE_API_URL}/comments`, comment);
      const submittedComment = response.data;
  
      // Add the profile picture URL to the submitted comment's author
      if (submittedComment.author.profilePic) {
        submittedComment.author.profilePic = process.env.REACT_APP_BASE_API_URL + '/images/' + submittedComment.author.profilePic;
      }
      
      props.setComments([...props.comments, submittedComment]);
    } catch (err) {
      console.error(err.message);
    }
  
    // Clear the comment text field
    setCommentText("");
  };
  

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    return <p>Please log in to post a comment.</p>;
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
          style={{ height: "30%", width: "70%" }}
          aria-label="Enter your comment here"
          aria-required="true"
          required
        ></textarea>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}

export default CommentForm;
